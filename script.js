// ===== Dados dos grupos (ajuste nomes/fotos conforme desejar) =====
const grupoA = [
  { nome: "Coop Paulo",  foto: "img/Cpaulo.PNG" },
  { nome: "D Paulo",  foto: "img/Dpaulo.jpg" },
  { nome: "Coop Ueverson", foto: "img/ueversom.jpg" },
  { nome: "D João ",foto: "img/Djoao.jpg" }
];

const grupoB = [
  { nome: "Coop Eliazer",   foto: "img/eliazer.jpg" },
  { nome: "D Reginaldo", foto: "img/reginaldo.PNG" },
  { nome: "Coop Manuel",foto: "img/manuel.PNG" },
  { nome: "D Carlinhos", foto: "img/carlinhos.PNG" }
];

// Fixos: Ensaio (terça) e Faespe (quinta)
const ensaio = { nome: "Ensaio", foto: "img/ensaio.jpg" };
const faespe = { nome: "Faespe", foto: "img/faesp.PNG" };
const sabado = { nome: "Grupo A/B", foto: "img/adbelem.jpeg" };


// Elementos do DOM
const mesAnoEl = document.getElementById("monthYear");
const calendario = document.getElementById("calendar");
let dataAtual = new Date();

document.getElementById("prev").onclick = () => mudarMes(-1);
document.getElementById("next").onclick = () => mudarMes(1);

function mudarMes(delta) {
  dataAtual.setMonth(dataAtual.getMonth() + delta);
  gerarCalendario();
}

/*
  Sequência fixa por semana (usando índices dos arrays de 0..3):
  Semana 1 -> [0,1]  (CP, DP)
  Semana 2 -> [2,3]  (UEV, JOAO)
  Semana 3 -> [3,2]  (JOAO, UEV)
  Semana 4 -> [1,0]  (DP, CP)
*/
const paresPorSemana = [
  [0, 1],
  [2, 3],
  [3, 2],
  [1, 0]
];
document.getElementById("printMonth").onclick = () => {
  window.print();
};

// Retorna par [indice1, indice2] para a semana (1-based)
function paresDaSemana(semana) {
  const idx = ( (semana - 1) % paresPorSemana.length + paresPorSemana.length ) % paresPorSemana.length;
  return paresPorSemana[idx];
}

function gerarCalendario() {
  calendario.innerHTML = "";
  const mes = dataAtual.getMonth(); // 0..11
  const ano = dataAtual.getFullYear();
  mesAnoEl.textContent = dataAtual.toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const primeiroDia = new Date(ano, mes, 1).getDay(); // 0..6
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const mesPar = ((mes + 1) % 2 === 0); // true se mês real (1-based) for par

  // Preenche espaços vazios antes do 1º
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.className = "day";
    calendario.appendChild(vazio);
  }

  // Para calcular "semana do mês" de forma estável: usar (dia + primeiroDia -1)/7 +1
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes, dia);
    const diaSemana = data.getDay(); // 0 domingo ... 1 seg ... 6 sab
    const semana = Math.floor((dia + primeiroDia - 1) / 7) + 1; // 1..5 possivelmente
    const div = document.createElement("div");
    div.className = "day";

    // número do dia
    const numero = document.createElement("div");
    numero.className = "number";
    numero.textContent = dia;
    div.appendChild(numero);

    // área da pessoa/fixo
    const pessoaDiv = document.createElement("div");
    pessoaDiv.className = "person";

    // TERÇA = Ensaio
    if (diaSemana === 2) {
      pessoaDiv.innerHTML = `<img src="${ensaio.foto}" alt="Ensaio"><span>${ensaio.nome}</span>`;
      div.classList.add("ensaio");
    }
    // QUINTA = Faespe
    else if (diaSemana === 4) {
      pessoaDiv.innerHTML = `<img src="${faespe.foto}" alt="Faespe"><span>${faespe.nome}</span>`;
      div.classList.add("faespe");
    }
    else {
      // Decide quais dias são relevantes para cada grupo, conforme paridade do mês
      // Grupo A trabalha:
      //  - meses pares => Segunda(1) e Sexta(5)
      //  - meses ímpares => Quarta(3) e Domingo(0)
      // Grupo B trabalha no oposto
      let atribuido = false;

      // Função auxiliar para aplicar par da semana a um grupo
      function aplicarParAoGrupo(grupoArray, classeGrupo) {
        const [i1, i2] = paresDaSemana(semana);
        // i1 => primeiro dia do par (ex.: segunda ou domingo)
        // i2 => segundo dia do par (ex.: sexta ou quarta)
        // Retorna objeto {primeiro, segundo}
        return { primeiro: grupoArray[i1], segundo: grupoArray[i2], classe: classeGrupo };
      }

      if (mesPar) {
        // meses pares
        if (diaSemana === 1 || diaSemana === 5) {
          // Segunda / Sexta -> Grupo A
          const par = aplicarParAoGrupo(grupoA, "grupoA");
          const pessoa = (diaSemana === 1) ? par.primeiro : par.segundo;
          pessoaDiv.innerHTML = `<img src="${pessoa.foto}" alt="${pessoa.nome}"><span>${pessoa.nome}</span>`;
          div.classList.add(par.classe);
          atribuido = true;
        } else if (diaSemana === 0 || diaSemana === 3) {
          // Domingo / Quarta -> Grupo B
          const par = aplicarParAoGrupo(grupoB, "grupoB");
          const pessoa = (diaSemana === 0) ? par.primeiro : par.segundo;
          pessoaDiv.innerHTML = `<img src="${pessoa.foto}" alt="${pessoa.nome}"><span>${pessoa.nome}</span>`;
          div.classList.add(par.classe);
          atribuido = true;
        }
      } else {
        // meses ímpares
        if (diaSemana === 1 || diaSemana === 5) {
          // Segunda / Sexta -> Grupo B
          const par = aplicarParAoGrupo(grupoB, "grupoB");
          const pessoa = (diaSemana === 1) ? par.primeiro : par.segundo;
          pessoaDiv.innerHTML = `<img src="${pessoa.foto}" alt="${pessoa.nome}"><span>${pessoa.nome}</span>`;
          div.classList.add(par.classe);
          atribuido = true;
        } else if (diaSemana === 0 || diaSemana === 3) {
          // Domingo / Quarta -> Grupo A
          const par = aplicarParAoGrupo(grupoA, "grupoA");
          const pessoa = (diaSemana === 0) ? par.primeiro : par.segundo;
          pessoaDiv.innerHTML = `<img src="${pessoa.foto}" alt="${pessoa.nome}"><span>${pessoa.nome}</span>`;
          div.classList.add(par.classe);
          atribuido = true;
        }
      }

      // se não atribuído, deixa vazio (ex.: sábados que não têm escala)
     // SÁBADO = atividade fixa
if (diaSemana === 6) {
  pessoaDiv.innerHTML = `<img src="${sabado.foto}" alt="${sabado.nome}"><span>${sabado.nome}</span>`;
  div.classList.add("sabado");
}
else {
  // Decide quais dias são relevantes...
  
}

    }

    div.appendChild(pessoaDiv);
    calendario.appendChild(div);
  }
}

// Inicializa
gerarCalendario();

