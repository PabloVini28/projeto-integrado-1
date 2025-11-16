import React from "react";
import { Grid } from "@mui/material";
import SummaryCard from "./SummaryCard.jsx";

export default function VisaoGeralPainel({ 
  receitasAlunos, 
  outrasReceitas, 
  despesas, 
  resultado 
}) {
  
  const resultadoValor = parseFloat(resultado.replace('R$ ', '').replace('.', '').replace(',', '.'));

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          title="RECEITAS DE ALUNOS"
          value={receitasAlunos}
          isGreen={true}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard title="OUTRAS RECEITAS" value={outrasReceitas} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard title="DESPESAS (MÊS)" value={despesas} isRed={true} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard 
          title="RESULTADO" 
          value={resultado} 
          isGreen={resultadoValor >= 0} 
          isRed={resultadoValor < 0} 
        />
      </Grid>
    </Grid>
  );
}