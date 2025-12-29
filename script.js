// ===== Dados dos grupos =====
const grupoA = [
  { nome: "Coop Paulo", atividade:"ABRIR E FECHAR A IGREJA", cargo:"Cooperador", endereco:"Av:Fortunato Camargo 1075", contato:"(11)91356-3576", foto: "img/Cpaulo.PNG" },
  { nome: "D Paulo",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Diácono", endereco:"Rua B", contato:"(11)94685-8301", foto: "img/Dpaulo.jpg" },
  { nome: "Coop Ueverson",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Cooperador", endereco:"Rua Curitiba ", contato:"(11)94493-4326", foto: "img/ueversom.jpg" },
  { nome: "D João",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Diácono", endereco:"Rua D", contato:"(11)98553-8590", foto: "img/Djoao.jpg" }
];

const grupoB = [
  { nome: "Coop Eliazer",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Cooperador", endereco:"Rua E", contato:"(11)98255-3053", foto: "img/eliazer.jpg" },
  { nome: "D Reginaldo",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Diácono", endereco:"Rua F", contato:"(11)96305-0243", foto: "img/reginaldo2.PNG" },
  { nome: "Coop Manuel",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Cooperador", endereco:"Rua G", contato:"(11)98980-6608", foto: "img/manuel.PNG" },
  { nome: "D Carlinhos",atividade:"ABRIR E FECHAR A IGREJA", cargo:"Diácono", endereco:"Rua H", contato:"(11)95362-4938", foto: "img/carlinhos.PNG" }
];

// Fixos
const ensaio = { nome:"Ensaio", cargo:"", endereco:"Rua Xingu 62",atividade:"Ensaio ", contato:"regentes", foto:"img/ensaio.jpg" };
const faespe = { nome:"Faesp", cargo:"", endereco:"Rua Xingu 62", contato:"", foto:"img/faesp.PNG" };
const sabado = { nome:"Grupo A/B", cargo:"", endereco:"", contato:"", foto:"img/adbelem.jpeg" };

// Sequência fixa por semana
const paresPorSemana = [
  [0,1],
  [2,3],
  [3,2],
  [1,0]
];

// DOM
const mesAnoEl = document.getElementById("monthYear");
const calendario = document.getElementById("calendar");
let dataAtual = new Date();

document.getElementById("prev").onclick = () => mudarMes(-1);
document.getElementById("next").onclick = () => mudarMes(1);
document.getElementById("printMonth").onclick = () => window.print();

function mudarMes(delta){
  dataAtual.setMonth(dataAtual.getMonth()+delta);
  gerarCalendario();
}

function paresDaSemana(semana){
  const idx = (semana-1) % paresPorSemana.length;
  return paresPorSemana[idx];
}

function gerarCalendario(){
  calendario.innerHTML = "";
  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();
  mesAnoEl.textContent = dataAtual.toLocaleString("pt-BR",{month:"long",year:"numeric"});

  const primeiroDia = new Date(ano,mes,1).getDay();
  const diasNoMes = new Date(ano,mes+1,0).getDate();
  const mesPar = ((mes+1)%2===0);

  for(let i=0;i<primeiroDia;i++){
    calendario.appendChild(document.createElement("div"));
  }

  for(let dia=1; dia<=diasNoMes; dia++){
    const data = new Date(ano,mes,dia);
    const diaSemana = data.getDay();
    const semana = Math.floor((dia + primeiroDia - 1) / 7) + 1;

    const div = document.createElement("div");
    div.className = "day";

    div.innerHTML = `<div class="number">${dia}</div>`;
    const pessoaDiv = document.createElement("div");
    pessoaDiv.className = "person";

    let pessoa = null;
    let classe = "";

    if(diaSemana === 2){
      pessoa = ensaio; classe="ensaio";
    }
    else if(diaSemana === 4){
      pessoa = faespe; classe="faespe";
    }
    else if(diaSemana === 6){
      pessoa = sabado; classe="sabado";
    }
    else{
      const [i1,i2] = paresDaSemana(semana);

      if(mesPar){
        if(diaSemana===1 || diaSemana===5){
          pessoa = (diaSemana===1 ? grupoA[i1] : grupoA[i2]);
          classe="grupoA";
        }
        else if(diaSemana===0 || diaSemana===3){
          pessoa = (diaSemana===0 ? grupoB[i1] : grupoB[i2]);
          classe="grupoB";
        }
      } else {
        if(diaSemana===1 || diaSemana===5){
          pessoa = (diaSemana===1 ? grupoB[i1] : grupoB[i2]);
          classe="grupoB";
        }
        else if(diaSemana===0 || diaSemana===3){
          pessoa = (diaSemana===0 ? grupoA[i1] : grupoA[i2]);
          classe="grupoA";
        }
      }
    }

    if(pessoa){
      pessoaDiv.innerHTML = `<img src="${pessoa.foto}"><span>${pessoa.nome}</span>`;
      div.classList.add(classe);
      div.dataset.pessoa = JSON.stringify(pessoa);
    }

    div.appendChild(pessoaDiv);
    calendario.appendChild(div);

    // clique
    div.onclick = () => {
      if(!div.dataset.pessoa) return;
      const p = JSON.parse(div.dataset.pessoa);
      modal.style.display="flex";
      modalFoto.src = p.foto;
      modalNome.textContent = p.nome;
      modalCargo.textContent = p.cargo;
      modalEndereco.textContent = p.endereco;
      modalContato.textContent = p.contato;
      modalAtividade.textContent = p.atividade;

    };
  }
}

// modal
closeModal.onclick = () => modal.style.display="none";
modal.onclick = e => { if(e.target.id==="modal") modal.style.display="none"; };

gerarCalendario();



