// ===============================
// CONFIGURAÇÕES
// ===============================
const DATA_BASE = new Date(2025, 0, 1); // 01/01/2025 (pode mudar se quiser)

// PESSOAS (ORDEM FIXA)
const grupo = [
  { nome:"Coop Paulo", cargo:"Cooperador", endereco:"Av: Fortunato Camargo 1075", contato:"(11) 91356-3576", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Cpaulo.PNG" },
  { nome:"D Paulo", cargo:"Diácono", endereco:"Rua B", contato:"(11) 94685-8301", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Dpaulo.jpg" },
  { nome:"Coop Ueverson", cargo:"Cooperador", endereco:"Rua Curitiba", contato:"(11) 94493-4326", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/ueversom.jpg" },
  { nome:"D João", cargo:"Diácono", endereco:"Rua D", contato:"(11) 98553-8590", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Djoao.jpg" },
  { nome:"Coop Eliazer", cargo:"Cooperador", endereco:"Rua E", contato:"(11) 98255-3053", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/eliazer.jpg" },
  { nome:"D Reginaldo", cargo:"Diácono", endereco:"Rua F", contato:"(11) 96305-0243", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/reginaldo2.PNG" },
  { nome:"Coop Manuel", cargo:"Cooperador", endereco:"Rua G", contato:"(11) 98980-6608", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/manuel.PNG" },
  { nome:"D Carlinhos", cargo:"Diácono", endereco:"Rua H", contato:"(11) 95362-4938", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/carlinhos.PNG" }
];

// EVENTOS FIXOS
const ensaio = { nome:"ENSAIO", atividade:"Ensaio", foto:"img/ensaio.jpg" };
const faespe = { nome:"FAESP", atividade:"Faesp", foto:"img/faesp.PNG" };
const sabado = { nome:"ESCALA A DEFINIR", atividade:"", foto:"img/adbelem.jpeg" };

// ===============================
// DOM
// ===============================
let dataAtual = new Date();
const calendario = document.getElementById("calendar");
const mesAnoEl = document.getElementById("monthYear");

// MODAL
const modal = document.getElementById("modal");
const modalFoto = document.getElementById("modalFoto");
const modalNome = document.getElementById("modalNome");
const modalCargo = document.getElementById("modalCargo");
const modalEndereco = document.getElementById("modalEndereco");
const modalContato = document.getElementById("modalContato");
const modalAtividade = document.getElementById("modalAtividade");

// BOTÕES
document.getElementById("prev").onclick = () => mudarMes(-1);
document.getElementById("next").onclick = () => mudarMes(1);
document.getElementById("printMonth").onclick = () => window.print();
document.getElementById("closeModal").onclick = () => modal.style.display="none";
modal.onclick = e => { if(e.target.id==="modal") modal.style.display="none"; };

// ===============================
// FUNÇÕES
// ===============================
function mudarMes(delta){
  dataAtual.setMonth(dataAtual.getMonth() + delta);
  gerarCalendario();
}

// Conta quantos dias de ESCALA já ocorreram desde a data base
function contarDiasEscala(data){
  let count = 0;
  let d = new Date(DATA_BASE);

  while(d < data){
    const diaSemana = d.getDay();
    if([0,1,3,5].includes(diaSemana)){
      count++;
    }
    d.setDate(d.getDate() + 1);
  }
  return count;
}

// ===============================
// GERAR CALENDÁRIO
// ===============================
function gerarCalendario(){
  calendario.innerHTML = "";

  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();

  mesAnoEl.textContent = dataAtual.toLocaleString("pt-BR", {
    month:"long",
    year:"numeric"
  });

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for(let i=0;i<primeiroDia;i++){
    calendario.appendChild(document.createElement("div"));
  }

  for(let dia=1; dia<=diasNoMes; dia++){
    const data = new Date(ano, mes, dia);
    const diaSemana = data.getDay();

    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<div class="number">${dia}</div>`;

    let pessoa=null, classe="";

    if(diaSemana===2){
      pessoa = ensaio; classe="ensaio";
    }
    else if(diaSemana===4){
      pessoa = faespe; classe="faespe";
    }
    else if(diaSemana===6){
      pessoa = sabado; classe="sabado";
    }
    else if([0,1,3,5].includes(diaSemana)){
      const diasPassados = contarDiasEscala(data);
      const indice = diasPassados % grupo.length;
      pessoa = grupo[indice];
      classe="grupoA";
    }

    if(pessoa){
      div.innerHTML += `
        <div class="person">
          <img src="${pessoa.foto}">
          <span>${pessoa.nome}</span>
        </div>`;
      div.classList.add(classe);
      div.dataset.pessoa = JSON.stringify(pessoa);
    }

    div.onclick = ()=>{
      if(!div.dataset.pessoa) return;
      const p = JSON.parse(div.dataset.pessoa);
      modal.style.display="flex";
      modalFoto.src=p.foto;
      modalNome.textContent=p.nome;
      modalCargo.textContent=p.cargo||"";
      modalEndereco.textContent=p.endereco||"";
      modalContato.textContent=p.contato||"";
      modalAtividade.textContent=p.atividade||"";
    };

    calendario.appendChild(div);
  }
}

gerarCalendario();


