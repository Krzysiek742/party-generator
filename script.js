
document.addEventListener("DOMContentLoaded", function () {
  const dni = ["Czwartek","Piątek", "Sobota", "Niedziela"];
  const miejscaWgMiasta = {
    "Katowice": ["Marcepan", "Gravitacja", "NOSPR", "GoodMood", "LaClave", "MilPasos", "Taneczna Kompania", "Nowy Dekameron", "Tapas LaFirinda", "Królestwo", "Dolina trzech stawów"],
    "Chorzów": ["Taneczne Kręgi", "Pizzeria Róża"],
    "Tychy": ["Przystań Kajakowa", "Mohito", "Dzika plaża"],
    "Kraków": ["Sabrosa","Tropical spot","Tauron Arena"],
    "Bielsko-Biala": ["Festiwal Kubański", "DANCE#LOVEit", "Metrum", "Grzyńskiego", "Hotel Sahara"],
    "Gliwice": ["Mohito", "LaClave", "Rynek"],
    "Bytom": ["Majowa"],
    "Świętochłowice": ["Stylowa Willa"],
    "Tarnowskie Góry": ["Ocean Club"],
    "Rybnik": ["Pink Bowling & Club"],
    "Dąbrowa Górnicza": ["Beach Bar Pogoria"]
  };

  const style = ["Salsa", "Bachata", "Kizomba", "Zouk", "Linia", "Cubana", "Rumba", "Afro", "Koncert", "Latino", "Reggeton"];
  const form = document.getElementById("form");

  dni.forEach((dzien) => {
    const block = document.createElement("div");
    block.className = "day-block";
    block.innerHTML = `<h3>${dzien.toUpperCase()}</h3>`;

    for (let i = 0; i < 5; i++) {
      const container = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const toggle = document.createElement("label");
      toggle.appendChild(checkbox);
      toggle.append(` Impreza ${i + 1}`);

      const eventBlock = document.createElement("div");
      eventBlock.className = "event-block";

      const selectMiasto = document.createElement("select");
      selectMiasto.className = "miasto";
      selectMiasto.innerHTML = Object.keys(miejscaWgMiasta).map(m => `<option value="${m}">${m}</option>`).join('') + '<option value="Inne">Inne</option>';

      const inputMiastoInne = document.createElement("input");
      inputMiastoInne.className = "miasto-inne";
      inputMiastoInne.placeholder = "Wpisz miasto";
      inputMiastoInne.style.display = "none";

      const selectMiejsce = document.createElement("select");
      selectMiejsce.className = "miejsce";

      const inputMiejsceInne = document.createElement("input");
      inputMiejsceInne.className = "miejsce-inne";
      inputMiejsceInne.placeholder = "Wpisz miejsce";
      inputMiejsceInne.style.display = "none";

      const inputLink = document.createElement("input");
      inputLink.type = "text";
      inputLink.className = "link";
      inputLink.placeholder = "Link do wydarzenia (opcjonalnie)";

      const opisInput = document.createElement("input");
      opisInput.type = "text";
      opisInput.className = "opis";
      opisInput.placeholder = "Krótki opis wydarzenia";

      const promoteInput = document.createElement("input");
      promoteInput.type = "checkbox";
      promoteInput.className = "promowane";
      const promoteLabel = document.createElement("label");
      promoteLabel.appendChild(promoteInput);
      promoteLabel.append(" Promuję to wydarzenie");

      const styleBox = document.createElement("div");
      styleBox.className = "checkboxes";
      styleBox.innerHTML = style.map(s => `<label><input type="checkbox" class="styl" value="${s}"> ${s}</label>`).join('');

      function updateMiejscaOptions(miasto) {
        if (miasto === "Inne") {
          selectMiejsce.style.display = "none";
          inputMiejsceInne.style.display = "block";
          inputMiastoInne.style.display = "block";
        } else {
          selectMiejsce.style.display = "block";
          inputMiejsceInne.style.display = "none";
          inputMiastoInne.style.display = "none";
          selectMiejsce.innerHTML = miejscaWgMiasta[miasto]?.map(m => `<option value="${m}">${m}</option>`).join('') + '<option value="Inne">Inne</option>';
        }
      }

      selectMiasto.addEventListener("change", function () {
        updateMiejscaOptions(this.value);
      });

      selectMiejsce.addEventListener("change", function () {
        inputMiejsceInne.style.display = this.value === "Inne" ? "block" : "none";
      });

      updateMiejscaOptions(selectMiasto.value);

      eventBlock.appendChild(selectMiasto);
      eventBlock.appendChild(inputMiastoInne);
      eventBlock.appendChild(selectMiejsce);
      eventBlock.appendChild(inputMiejsceInne);
      eventBlock.appendChild(opisInput);
      eventBlock.appendChild(styleBox);
      eventBlock.appendChild(inputLink);
      eventBlock.appendChild(promoteLabel);

      checkbox.addEventListener("change", function () {
        eventBlock.style.display = this.checked ? 'block' : 'none';
      });

      container.appendChild(toggle);
      container.appendChild(eventBlock);
      block.appendChild(container);
    }
    form.appendChild(block);
  });

  document.getElementById("generuj-btn").addEventListener("click", generujPost);
});

function kopiujWynik() {
  const text = document.getElementById("wynik").value;
  navigator.clipboard.writeText(text);
}

function generujPost() {
  const blocks = document.querySelectorAll(".day-block");
  const dniTekst = ["CZWARTEK","PIĄTEK", "SOBOTA", "NIEDZIELA"];
  let wynik = "🎉 Zestawienie imprezowe na ten weekend:\n\n";
  let wynikAnkieta = "";

  blocks.forEach((block, idx) => {
    const containers = block.querySelectorAll(".event-block");
    let dzienWiersz = "";

    containers.forEach((eventBlock) => {
      const checkbox = eventBlock.previousElementSibling.querySelector("input[type=checkbox]");
      if (!checkbox || !checkbox.checked) return;

      const miasto = eventBlock.querySelector(".miasto");
      const miastoInne = eventBlock.querySelector(".miasto-inne");
      const miejsce = eventBlock.querySelector(".miejsce");
      const miejsceInne = eventBlock.querySelector(".miejsce-inne");
      const opis = eventBlock.querySelector(".opis");
      const link = eventBlock.querySelector(".link");
      const checkboxContainer = eventBlock.querySelector(".checkboxes");
      const promoteCheckbox = eventBlock.querySelector(".promowane");

      const finalMiasto = miasto.value === "Inne" ? miastoInne.value.trim() : miasto.value;
      const finalMiejsce = miejsce.value === "Inne" ? miejsceInne.value.trim() : miejsce.value;
      const styleZaznaczone = [...checkboxContainer.querySelectorAll("input.styl:checked")].map(cb => cb.value).join("/");

      const prefix = promoteCheckbox.checked ? "⭐ " : "➡️ ";

      dzienWiersz += `${prefix}${finalMiasto}: ${finalMiejsce} (${styleZaznaczone})${opis.value.trim() ? ` – ${opis.value.trim()}` : ""}\n`;
      if (link && link.value.trim() !== "") {
        dzienWiersz += `🔗 ${link.value.trim()}\n`;
      }
      wynikAnkieta += `${dniTekst[idx]}: ${finalMiasto}: ${finalMiejsce} (${styleZaznaczone})\n`;
    });

    if (dzienWiersz.trim() !== "") {
      wynik += `🗕️ ${dniTekst[idx]}:\n` + dzienWiersz + "\n";
    }
  });

  wynik += "Do zobaczenia na parkiecie! 💃🕺\n\n" + document.getElementById("hashtagi").value;
  document.getElementById("wynik").value = wynik;
  document.getElementById("ankieta").value = wynikAnkieta;

  const ankietaDiv = document.getElementById("kopiuj-ankiete");
  ankietaDiv.innerHTML = "";
  const linie = wynikAnkieta.trim().split("\n");
  linie.forEach((l) => {
    const div = document.createElement("div");
    div.className = "copy-line";
    const span = document.createElement("span");
    span.textContent = l;
    const btn = document.createElement("button");
    btn.textContent = "📋 Kopiuj";
    btn.onclick = () => navigator.clipboard.writeText(l);
    div.appendChild(span);
    div.appendChild(btn);
    ankietaDiv.appendChild(div);
  });
}
