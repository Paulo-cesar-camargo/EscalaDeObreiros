// ===============================
// GRUPO ÚNICO (ESCALA SEQUENCIAL)
// ===============================
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
const ensaio = { nome:"Ensaio", atividade:"Ensaio", foto:"img/ensaio.jpg" };
const faespe = { nome:"Faesp", atividade:"Faesp", foto:"img/faesp.PNG" };
const sabado = { nome:"Grupo A/B", atividade:"", foto:"img/adbelem.jpeg" };

let indicePessoa = 0;
let dataAtual = new Date();

// DOM
const mesAnoEl = document.getElementById("monthYear");
const calendario = document.getElementById("calendar");
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

function mudarMes(delta){
  dataAtual.setMonth(dataAtual.getMonth() + delta);
  gerarCalendario();
}

function gerarCalendario(){
  calendario.innerHTML = "";
  indicePessoa = 0;

  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();

  mesAnoEl.textContent = dataAtual.toLocaleString("pt-BR",{month:"long",year:"numeric"});

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

    const pessoaDiv = document.createElement("div");
    pessoaDiv.className = "person";

    let pessoa=null, classe="";

    if(diaSemana===2){ pessoa=ensaio; classe="ensaio"; }
    else if(diaSemana===4){ pessoa=faespe; classe="faespe"; }
    else if(diaSemana===6){ pessoa=sabado; classe="sabado"; }
    else if([0,1,3,5].includes(diaSemana)){
      pessoa=grupo[indicePessoa];
      classe="grupoA";
      indicePessoa = (indicePessoa+1) % grupo.length;
    }

    if(pessoa){
      pessoaDiv.innerHTML = `<img src="${pessoa.foto}"><span>${pessoa.nome}</span>`;
      div.classList.add(classe);
      div.dataset.pessoa = JSON.stringify(pessoa);
    }

    div.appendChild(pessoaDiv);
    calendario.appendChild(div);

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
  }
}

gerarCalendario();

