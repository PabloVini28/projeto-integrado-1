import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}#/login`);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`), { hash: 'login' });
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  // CORREÇÃO: Desabilita a sandbox da GPU para corrigir o erro NSS
  app.commandLine.appendSwitch('disable-gpu-sandbox');

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// -------------------------------------------------------------------
// LÓGICA DE PDF REUTILIZÁVEL 
// -------------------------------------------------------------------

// Função genérica para criar o PDF
async function createPdf(options) {
  const { title, headers, columnWidths, data, defaultFileName } = options;

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: `Salvar Relatório de ${title}`,
    defaultPath: defaultFileName || `relatorio_${new Date().toISOString().split('T')[0]}.pdf`,
    filters: [{ name: 'Arquivos PDF', extensions: ['pdf'] }]
  });

  if (canceled || !filePath) {
    return { success: false, error: 'Save dialog canceled' };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Carregar o logo
    let logoPath;
    if (app.isPackaged) {
      logoPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/assets/logo/icon.png`);
    } else {
      logoPath = path.join(__dirname, '../../src/assets/logo/icon.png');
    }
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);

    let page = pdfDoc.addPage([841.89, 595.28]); // A4 Paisagem
    const { width, height } = page.getSize();
    const margin = 50;
    const rowHeight = 20;

    // --- Funções Internas de Desenho ---
    const drawPageHeader = (currentPage) => {
      currentPage.drawImage(logoImage, { x: margin, y: height - margin - 40, width: 40, height: 40 });
      currentPage.drawText('Corpo em Forma Gestão', { x: margin + 50, y: height - margin - 15, size: 18, font: helveticaBoldFont, color: rgb(0, 0, 0) });
      currentPage.drawText(title, { x: margin + 50, y: height - margin - 35, size: 14, font: helveticaFont, color: rgb(0.3, 0.3, 0.3) });
      return height - margin - 80;
    };

    const drawTableHeader = (currentPage, yPos) => {
      const tableRowHeight = 25;
      currentPage.drawRectangle({ x: margin, y: yPos - tableRowHeight, width: width - (margin * 2), height: tableRowHeight, color: rgb(0.9, 0.9, 0.9) });
      
      let currentX = margin + 5;
      currentPage.setFont(helveticaBoldFont);
      currentPage.setFontSize(10);
      
      headers.forEach((header, i) => {
        currentPage.drawText(header, { x: currentX, y: yPos - 17, color: rgb(0, 0, 0) });
        currentX += columnWidths[i];
      });
      return yPos - tableRowHeight;
    };
    // --- Fim Funções Internas ---

    let y = drawPageHeader(page);
    y = drawTableHeader(page, y, margin, columnWidths, helveticaBoldFont);

    page.setFont(helveticaFont);
    page.setFontSize(10);

    for (const [index, row] of data.entries()) {
      if (y < margin + rowHeight) {
        page = pdfDoc.addPage([841.89, 595.28]);
        y = drawPageHeader(page);
        y = drawTableHeader(page, y, margin, columnWidths, helveticaBoldFont);
      }

      // Desenha o fundo zebrado
      if (index % 2 === 0) {
        page.drawRectangle({ x: margin, y: y - rowHeight, width: width - (margin * 2), height: rowHeight, color: rgb(0.97, 0.97, 0.97) });
      }

      let currentX = margin + 5;
      // Desenha cada célula da linha
      row.forEach((text, i) => {
        page.drawText(text || '-', { x: currentX, y: y - 14, color: rgb(0, 0, 0) });
        currentX += columnWidths[i];
      });
      y -= rowHeight;
    }

    // Adiciona data de emissão no final
    y -= 30;
    if (y < margin) { 
      page = pdfDoc.addPage([841.89, 595.28]);
      y = height - margin;
    }
    const emissionDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const emissionText = `Relatório emitido em: ${emissionDate}`;
    const textWidth = helveticaFont.widthOfTextAtSize(emissionText, 9);
    page.drawText(emissionText, { x: width - margin - textWidth, y: y, size: 9, color: rgb(0.3, 0.3, 0.3) });

    // Salva o arquivo
    const pdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(filePath, pdfBytes);

    return { success: true, path: filePath };

  } catch (error) {
    console.error('Falha ao gerar o PDF:', error);
    return { success: false, error: error.message };
  }
}

// Este é o único "ouvinte". Ele recebe as opções do React e as passa para o gerador de PDF.
ipcMain.handle('generate-report', async (event, options) => {
    return await createPdf(options);
});