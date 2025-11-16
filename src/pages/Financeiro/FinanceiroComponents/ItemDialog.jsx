import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  CircularProgress,
  Typography 
} from "@mui/material";

const mockAlunos = [
    { id: 1, nome: 'Gabriel Pereira de Souza' },
    { id: 2, nome: 'Ana Clara Souza' },
    { id: 3, nome: 'Rafael Oliveira Almeida' },
];


const formatDateToInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const today = formatDateToInput(new Date());

export default function ItemDialog({
  open,
  onClose,
  onSave,
  title,
  itemToEdit,
  isRecipe,
}) {
  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errors, setErrors] = useState({});
  
  const [showErrorText, setShowErrorText] = useState(false);

  const [buscaAluno, setBuscaAluno] = useState("");
  const [opcoesAlunos, setOpcoesAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);

  const type = isRecipe ? "receita" : "despesa";
  const categoriasReceita = ["Alunos", "Outras"];
  const categoriasDespesa = [
    "Instalações e infraestrutura",
    "Pessoal",
    "Investimentos",
    "Operacional e Administrativo",
    "Outras"
  ];

  useEffect(() => {
    if (!isRecipe || categoria !== 'Alunos') {
        setOpcoesAlunos([]);
        return;
    }
    setLoadingAlunos(true);
    setOpcoesAlunos([]); 
    const timer = setTimeout(() => {
      if (buscaAluno === "") {
         setOpcoesAlunos(mockAlunos.slice(0, 5));
      } else {
        const alunosFiltrados = mockAlunos.filter((aluno) =>
          aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase())
        );
        setOpcoesAlunos(alunosFiltrados);
      }
      setLoadingAlunos(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [buscaAluno, isRecipe, categoria]);

  useEffect(() => {
    if (open) { 
        if (itemToEdit) {
            setCategoria(itemToEdit.categoria || "");
            setNome(itemToEdit.nome || "");
            
            let dataFormatada = today;
            if (itemToEdit.data) {
                if (itemToEdit.data.includes('/')) {
                    const [dia, mes, ano] = itemToEdit.data.split('/');
                    dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                } else {
                    dataFormatada = itemToEdit.data;
                }
            }
            setData(dataFormatada);
            setValor(String(itemToEdit.valor) || "");
            setDescricao(itemToEdit.descricao || "");
            
            if (isRecipe && itemToEdit.categoria === 'Alunos' && itemToEdit.nome_aluno) {
                const aluno = mockAlunos.find(a => a.nome === itemToEdit.nome_aluno);
                setAlunoSelecionado(aluno || null);
                if (aluno) {
                    setOpcoesAlunos([aluno]);
                }
            } else {
                setAlunoSelecionado(null);
            }
        } else {
            setCategoria("");
            setNome("");
            setData(today);
            setValor("");
            setDescricao("");
            setAlunoSelecionado(null);
            setBuscaAluno("");
        }
        setErrors({}); 
        setShowErrorText(false); 
    }
  }, [itemToEdit, isRecipe, open]);


  const validateForm = () => {
    const newErrors = {};

    if (!categoria) newErrors.categoria = true;
    if (!data) newErrors.data = true;
    if (!valor || parseFloat(valor) <= 0) newErrors.valor = true;

    if (isRecipe) {
        if (categoria === 'Alunos' && !alunoSelecionado) {
            newErrors.aluno = true;
        }
        if (categoria === 'Outras' && !nome.trim()) {
            newErrors.nome = true;
        }
    } else { 
        if (!nome.trim()) {
            newErrors.nome = true;
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = () => {
    if (!validateForm()) {
        setShowErrorText(true); 
        return;
    }
    setShowErrorText(false); 

    const [ano, mes, dia] = data.split('-');
    const dataFormatadaSalvar = `${dia}/${mes}/${ano}`;

    let itemData = {
      categoria,
      data: dataFormatadaSalvar,
      valor: parseFloat(valor) || 0,
      descricao,
      type: type,
    };

    if (isRecipe) {
        if (categoria === 'Alunos') {
            itemData.nome = 'Mensalidade';
            itemData.aluno_id = alunoSelecionado?.id || null;
            itemData.nome_aluno = alunoSelecionado?.nome || null;
        } else {
            itemData.nome = nome;
        }
    } else {
        itemData.nome = nome;
    }

    onSave(itemData);
  };

  const renderReceitaForm = () => (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12}>
        <FormControl fullWidth size="small" required error={!!errors.categoria}>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            value={categoria}
            label="Categoria"
            onChange={(e) => setCategoria(e.target.value)}
          >
            <MenuItem value="" disabled>
              *Selecione uma categoria*
            </MenuItem>
            {categoriasReceita.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {categoria === 'Alunos' && (
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            size="small"
            value={alunoSelecionado}
            onChange={(event, newValue) => {
              setAlunoSelecionado(newValue);
            }}
            inputValue={buscaAluno}
            onInputChange={(event, newInputValue) => {
              setBuscaAluno(newInputValue);
            }}
            options={opcoesAlunos}
            getOptionLabel={(option) => option.nome}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loadingAlunos}
            loadingText="Buscando alunos..."
            noOptionsText="Nenhum aluno encontrado"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecionar Aluno"
                required
                error={!!errors.aluno}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingAlunos ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
      )}

      {categoria === 'Outras' && (
        <Grid item xs={12}>
          <TextField
            autoFocus
            required
            error={!!errors.nome}
            id="nome"
            label="Nome da Receita"
            fullWidth
            size="small"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Grid>
      )}

      <Grid item xs={12} sm={6}>
        <TextField
          required
          error={!!errors.data}
          id="data"
          label="Data"
          type="date"
          fullWidth
          size="small"
          value={data}
          onChange={(e) => setData(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: today }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          error={!!errors.valor}
          id="valor"
          label="Valor"
          fullWidth
          size="small"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            type: "number",
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          id="descricao"
          label="Descrição (Opcional)"
          fullWidth
          size="small"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );

  const renderDespesaForm = () => (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12}>
        <TextField
          autoFocus
          required
          error={!!errors.nome}
          id="nome"
          label="Nome da Despesa"
          fullWidth
          size="small"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControl fullWidth size="small" required error={!!errors.categoria}>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            value={categoria}
            label="Categoria"
            onChange={(e) => setCategoria(e.target.value)}
          >
            <MenuItem value="" disabled>
              *Selecione uma categoria*
            </MenuItem>
            {categoriasDespesa.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
       <TextField
          required
          error={!!errors.data}
          id="data"
          label="Data"
          type="date"
          fullWidth
          size="small"
          value={data}
          onChange={(e) => setData(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: today }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          error={!!errors.valor}
          id="valor"
          label="Valor"
          fullWidth
          size="small"
          value={valor}
          onChange={(e) => setValor(e.target.value)} 
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            type: "number",
          }}
        />
      </Grid>

      <Grid item xs={12}>
       <TextField
          id="descricao"
          label="Descrição (Opcional)"
          fullWidth
          size="small"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "normal",
          fontSize: "1.5rem",
          pb: 0,
        }}
      >
        {title}
      </DialogTitle>
      
      <DialogContent>
        {isRecipe ? renderReceitaForm() : renderDespesaForm()}
        
        {showErrorText && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ textAlign: 'center', mt: 2 }}
            >
              Por favor, preencha os campos obrigatórios.
            </Typography>
        )}
      </DialogContent>
      
      <DialogActions
        sx={{ p: 3, pt: 1, justifyContent: 'flex-end', gap: 1 }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="small" 
          sx={{
            backgroundColor: "#343a40",
            color: "white",
            "&:hover": { backgroundColor: "#23272b" },
            fontWeight: "normal",
            borderRadius: '8px',
          }}
        >
          CANCELAR
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small" 
          sx={{
            backgroundColor: "#F2D95C",
            color: "black",
            "&:hover": { backgroundColor: "#e0c850" },
            fontWeight: "normal", 
            borderRadius: '8px',
          }}
        >
          SALVAR {type.toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}