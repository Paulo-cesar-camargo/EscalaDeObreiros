// ===============================
// CONFIGURAÇÕES
// ===============================
const DATA_BASE = new Date(2025, 0, 1); // 01/01/2025 (pode mudar se quiser)
const ALERTA_HORA = 17;
const ALERTA_MINUTO = 0;
const ALERTA_INTERVALO_MS = 30000;

// PESSOAS (ORDEM FIXA)
const grupo = [
  { nome:"Coop Paulo", cargo:"Cooperador", endereco:"Av: Fortunato Camargo 1075", contato:"(11) 91356-3576", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Cpaulo.PNG" },
  { nome:"D Reginaldo", cargo:"Diácono", endereco:"Rua F", contato:"(11) 96305-0243", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/reginaldo2.PNG" },
  { nome:"D Carlinhos", cargo:"Diácono", endereco:"Rua H", contato:"(11) 95362-4938", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/carlinhos.PNG" },
  { nome:"D João", cargo:"Diácono", endereco:"Rua D", contato:"(11) 98553-8590", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Djoao.jpg" },
  { nome:"Coop Eliazer", cargo:"Cooperador", endereco:"Rua E", contato:"(11) 98255-3053", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/eliazer.jpg"},
  { nome:"D Paulo", cargo:"Diácono", endereco:"Rua B", contato:"(11) 94685-8301", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/Dpaulo.jpg" },
  { nome:"Coop Manuel", cargo:"Cooperador", endereco:"Rua G", contato:"(11) 98980-6608", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/manuel.PNG" },
  { nome:"D zezinho", cargo:"Diácono", endereco:"Rua Curitiba", contato:"(11) 95083-4846", atividade:"ABRIR E FECHAR A IGREJA", foto:"img/zezinho.PNG" }

];

// EVENTOS FIXOS
const ensaio = { nome:"ENSAIO", atividade:"Ensaio", foto:"img/ensaio.jpg" };
const faespe = { nome:"FAESP", atividade:"Faesp", foto:"img/faesp.PNG" };

// SÁBADOS (com fotos específicas)
const sabado1 = {
  nome:"CULTO DOS JOVENS",
  atividade:"Primeiro sábado do mês",
  foto:"img/jovens.png",
  membros:["D João","Coop Eliazer","D zezinho"]
};
const sabado2 = {
  nome:"SANTA CEIA NA SEDE",
  atividade:"Segundo sábado do mês",
  foto:"img/adbelem.jpeg",
  membros:["Coop Manuel","D Paulo","D Reginaldo","D Carlinhos","D João","Coop Eliazer","D zezinho","Coop Paulo"]
};
const sabado3 = {
  nome:"CULTO DOS VARÕES",
  atividade:"Terceiro sábado do mês",
  foto:"img/varoes.jpeg",
  membros:["D Carlinhos","D Reginaldo"]
};
const sabado4 = {
  nome:"CULTO DOS ADOLESCENTES",
  atividade:"Quarto sábado do mês",
  foto:"img/adolecentes.png",
  membros:["Coop Manuel","D Paulo","D Reginaldo"]
};
const sabado5 = {
  nome:"ESCALA A DEFINIR",
  atividade:"Quinto sábado (quando houver)",
  foto:"img/adbelem.jpeg",
  membros:[]
};

// ===============================
// DOM
// ===============================
let dataAtual = new Date();
const calendario = document.getElementById("calendar");
const mesAnoEl = document.getElementById("monthYear");
const toast = document.getElementById("toast");

// MODAL
const modal = document.getElementById("modal");
const modalFotos = document.getElementById("modalFotos");
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

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getNextSaturday(fromDate){
  const d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const day = d.getDay();
  const delta = (6 - day + 7) % 7;
  d.setDate(d.getDate() + delta);
  return d;
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

function hashString(str){
  let hash = 0;
  for(let i=0;i<str.length;i++){
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickDeterministic(list, seedStr){
  if(!list.length) return null;
  const idx = hashString(seedStr) % list.length;
  return list[idx];
}

function findPessoaByNome(nome){
  return grupo.find(p => p.nome === nome) || null;
}

function pessoaParaData(data){
  const diaSemana = data.getDay();

  if(diaSemana === 2) return { pessoa: ensaio, classe: "ensaio" };
  if(diaSemana === 4) return { pessoa: faespe, classe: "faespe" };
  if(diaSemana === 6) {
    const semanaDoMes = Math.ceil(data.getDate() / 7);
    if(semanaDoMes === 1) return { pessoa: sabado1, classe: "sabado" };
    if(semanaDoMes === 2) return { pessoa: sabado2, classe: "sabado" };
    if(semanaDoMes === 3) return { pessoa: sabado3, classe: "sabado" };
    if(semanaDoMes === 4) return { pessoa: sabado4, classe: "sabado" };
    return { pessoa: sabado5, classe: "sabado" };
  }

  if([0,1,3,5].includes(diaSemana)){
    const diasPassados = contarDiasEscala(data);
    const indice = diasPassados % grupo.length;
    return { pessoa: grupo[indice], classe: "grupoA" };
  }

  return { pessoa: null, classe: "" };
}

function showToast(mensagem){
  if(!toast) return;
  toast.textContent = mensagem;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 5000);
}

function checarAlerta17h(){
  const agora = new Date();
  const chave = `alerta-17h-${agora.toISOString().slice(0,10)}`;

  const passouHora =
    agora.getHours() > ALERTA_HORA ||
    (agora.getHours() === ALERTA_HORA && agora.getMinutes() >= ALERTA_MINUTO);

  if(!passouHora) return;
  if(localStorage.getItem(chave)) return;

  localStorage.setItem(chave, "1");
  const { pessoa } = pessoaParaData(agora);
  const nome = pessoa && pessoa.nome ? pessoa.nome : "Sem escala";
  showToast(`17:00 — Hoje: ${nome}`);
}

// ===============================
// GERAR CALENDÁRIO
// ===============================
function gerarCalendario(){
  calendario.innerHTML = "";

  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();
  const hoje = new Date();
  const proximoSabado = getNextSaturday(hoje);

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
    const isToday = isSameDate(data, hoje);
    const isProximoSabado = !isToday && data.getDay() === 6 && isSameDate(data, proximoSabado);

    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<div class="number">${dia}</div>`;

    const { pessoa, classe } = pessoaParaData(data);

    if(pessoa){
      const blinkClass = isToday ? "blink" : "";
      const nomesHtml = Array.isArray(pessoa.nomes) && pessoa.nomes.length
        ? `<div class="names">${pessoa.nomes.map(n => `<div class="name">${n}</div>`).join("")}</div>`
        : "";
      div.innerHTML += `
        <div class="person">
          <img src="${pessoa.foto}" alt="${pessoa.nome}">
          <span class="${blinkClass}">${pessoa.nome}</span>
          ${nomesHtml}
        </div>`;
      div.classList.add(classe);
      div.dataset.pessoa = JSON.stringify(pessoa);
      if(classe === "sabado") {
        div.dataset.isSabado = "1";
      }
    }

    if(isToday){
      div.classList.add("is-today", "blink-day");
    }
    if(isProximoSabado){
      div.classList.add("blink-soon");
    }

    div.onclick = ()=>{
      if(!div.dataset.pessoa) return;
      const p = JSON.parse(div.dataset.pessoa);
      modal.style.display="flex";
      if(div.dataset.isSabado === "1"){
        modal.classList.add("hide-details");
      } else {
        modal.classList.remove("hide-details");
      }
      modalFotos.innerHTML = "";
      if(Array.isArray(p.membros) && p.membros.length){
        p.membros.forEach(nome => {
          const pessoaMembro = findPessoaByNome(nome);
          if(pessoaMembro && pessoaMembro.foto){
            const img = document.createElement("img");
            img.src = pessoaMembro.foto;
            img.alt = pessoaMembro.nome;
            modalFotos.appendChild(img);
          }
        });
      } else if(p.foto){
        const img = document.createElement("img");
        img.src = p.foto;
        img.alt = p.nome || "Foto";
        modalFotos.appendChild(img);
      }

      modalNome.textContent=p.nome;
      const ocultarDetalhes = Array.isArray(p.membros) && p.membros.length;
      modalCargo.textContent = ocultarDetalhes ? "" : (p.cargo||"");
      modalEndereco.textContent = ocultarDetalhes ? "" : (p.endereco||"");
      modalContato.textContent = ocultarDetalhes ? "" : (p.contato||"");
      if(Array.isArray(p.nomes) && p.nomes.length){
        modalAtividade.textContent = `${p.atividade} — ${p.nomes.join(", ")}`;
      } else {
        modalAtividade.textContent=p.atividade||"";
      }
    };

    calendario.appendChild(div);
  }
}

gerarCalendario();
checarAlerta17h();
setInterval(checarAlerta17h, ALERTA_INTERVALO_MS);
