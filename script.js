/* =====================================================
   ROTINA DA JANAINA
   ===================================================== */


/* -----------------------------
   DADOS
----------------------------- */

const STORAGE_KEY = "rotinaJanaina";


const defaultData = {

    routine: {

        Segunda: [],
        Terça: [],
        Quarta: [],
        Quinta: [],
        Sexta: [],
        Sábado: []

    },

    extras: {},

    reminders: [],

    goals: [],

    completed: {}

};


let data =
    JSON.parse(localStorage.getItem(STORAGE_KEY))
    || defaultData;


let selectedDay = getTodayName();


/* -----------------------------
   DIAS
----------------------------- */

const days = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
];


const shortDays = [
    "SEG",
    "TER",
    "QUA",
    "QUI",
    "SEX",
    "SÁB"
];


/* -----------------------------
   SALVAR
----------------------------- */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* -----------------------------
   DATA
----------------------------- */

function getDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getTodayName() {

    const day =
        new Date().getDay();

    if (day === 0) return "Segunda";

    if (day === 1) return "Segunda";

    if (day === 2) return "Terça";

    if (day === 3) return "Quarta";

    if (day === 4) return "Quinta";

    if (day === 5) return "Sexta";

    return "Sábado";

}


/* -----------------------------
   SAUDAÇÃO
----------------------------- */

function updateGreeting() {

    const hour =
        new Date().getHours();


    let greeting;


    if (hour < 12) {

        greeting = "Bom dia, Janaina! ☀️";

    } else if (hour < 18) {

        greeting = "Boa tarde, Janaina! 💜";

    } else {

        greeting = "Boa noite, Janaina! 🌙";

    }


    document.getElementById(
        "greeting"
    ).textContent = greeting;


    document.getElementById(
        "currentDate"
    ).textContent =
        new Date().toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* -----------------------------
   ABAS DOS DIAS
----------------------------- */

function renderDays() {

    const container =
        document.getElementById("days");


    container.innerHTML = "";


    days.forEach((day, index) => {

        const button =
            document.createElement("button");


        button.className =
            "day";


        if (day === selectedDay) {

            button.classList.add("active");

        }


        button.textContent =
            shortDays[index];


        button.onclick = () => {

            selectedDay = day;

            renderDays();

            renderRoutine();

        };


        container.appendChild(button);

    });

}


/* -----------------------------
   ROTINA FIXA
----------------------------- */

function renderRoutine() {

    const list =
        document.getElementById(
            "routineList"
        );


    list.innerHTML = "";


    const routines =
        data.routine[selectedDay];


    if (!routines.length) {

        list.innerHTML = `
            <div class="empty">
                Nenhuma atividade cadastrada.
                Clique em "+ Adicionar".
            </div>
        `;

        updateRoutineProgress();

        return;

    }


    routines.forEach((routine, index) => {

        const row =
            document.createElement("div");


        row.className =
            "routine-row";


        const checkKey =
            getRoutineKey(
                selectedDay,
                index
            );


        const checked =
            data.completed[checkKey]
            || false;


        row.innerHTML = `

            <input
                type="time"
                value="${routine.time || ""}"
                onchange="
                    updateRoutineTime(
                        ${index},
                        this.value
                    )
                "
            >


            <input
                type="text"
                value="${escapeHTML(routine.name)}"
                onchange="
                    updateRoutineName(
                        ${index},
                        this.value
                    )
                "
            >


            <input
                type="checkbox"
                ${checked ? "checked" : ""}
                onchange="
                    toggleRoutine(
                        ${index},
                        this.checked
                    )
                "
            >

        `;


        list.appendChild(row);

    });


    updateRoutineProgress();

}


/* -----------------------------
   ADICIONAR ROTINA
----------------------------- */

function addRoutine() {

    data.routine[selectedDay].push({

        time: "08:00",

        name: "Nova atividade"

    });


    saveData();

    renderRoutine();

}


/* -----------------------------
   EDITAR ROTINA
----------------------------- */

function updateRoutineTime(
    index,
    value
) {

    data.routine[selectedDay][index]
        .time = value;

    saveData();

}


function updateRoutineName(
    index,
    value
) {

    data.routine[selectedDay][index]
        .name = value;

    saveData();

}


/* -----------------------------
   CHECK ROTINA
----------------------------- */

function getRoutineKey(
    day,
    index
) {

    return `${getDateKey()}_routine_${day}_${index}`;

}


function toggleRoutine(
    index,
    checked
) {

    const key =
        getRoutineKey(
            selectedDay,
            index
        );


    data.completed[key] =
        checked;


    saveData();

    updateRoutineProgress();

    updateWeeklyProgress();

}


/* -----------------------------
   PROGRESSO ROTINA
----------------------------- */

function updateRoutineProgress() {

    const routines =
        data.routine[selectedDay];


    if (!routines.length) {

        setProgress(
            "routine",
            0
        );

        return;

    }


    let completed = 0;


    routines.forEach(
        (_, index) => {

            const key =
                getRoutineKey(
                    selectedDay,
                    index
                );


            if (data.completed[key]) {

                completed++;

            }

        }
    );


    const percentage =
        Math.round(
            completed /
            routines.length *
            100
        );


    setProgress(
        "routine",
        percentage
    );

}


/* -----------------------------
   PROGRESSO
----------------------------- */

function setProgress(
    type,
    percentage
) {

    if (type === "routine") {

        document.getElementById(
            "routineProgress"
        ).style.width =
            `${percentage}%`;


        document.getElementById(
            "routineProgressText"
        ).textContent =
            `${percentage}%`;


        document.getElementById(
            "routinePercentage"
        ).textContent =
            `${percentage}%`;

    }


    if (type === "extra") {

        document.getElementById(
            "extraProgress"
        ).style.width =
            `${percentage}%`;


        document.getElementById(
            "extraProgressText"
        ).textContent =
            `${percentage}%`;


        document.getElementById(
            "extraPercentage"
        ).textContent =
            `${percentage}%`;

    }

}


/* -----------------------------
   ATIVIDADES EXTRAS
----------------------------- */

function addExtra() {

    const input =
        document.getElementById(
            "extraInput"
        );


    const text =
        input.value.trim();


    if (!text) return;


    const date =
        getDateKey();


    if (!data.extras[date]) {

        data.extras[date] = [];

    }


    data.extras[date].push({

        id: Date.now(),

        text: text

    });


    input.value = "";


    saveData();

    renderExtras();

}


/* -----------------------------
   RENDER EXTRAS
----------------------------- */

function renderExtras() {

    const container =
        document.getElementById(
            "extraList"
        );


    container.innerHTML = "";


    const date =
        getDateKey();


    const extras =
        data.extras[date] || [];


    if (!extras.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma atividade extra hoje.
            </div>
        `;

        setProgress("extra", 0);

        return;

    }


    extras.forEach(
        (extra, index) => {

            const key =
                `${date}_extra_${extra.id}`;


            const checked =
                data.completed[key]
                || false;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "extra-item";


            if (checked) {

                item.classList.add(
                    "completed"
                );

            }


            item.innerHTML = `

                <input
                    type="checkbox"
                    ${checked ? "checked" : ""}
                >


                <span>
                    ${escapeHTML(extra.text)}
                </span>


                <button
                    class="delete"
                    title="Excluir"
                >
                    ×
                </button>

            `;


            const checkbox =
                item.querySelector(
                    "input"
                );


            checkbox.onchange =
                () => {

                    data.completed[key] =
                        checkbox.checked;

                    saveData();

                    renderExtras();

                    updateWeeklyProgress();

                };


            const deleteButton =
                item.querySelector(
                    ".delete"
                );


            deleteButton.onclick =
                () => {

                    extras.splice(
                        index,
                        1
                    );

                    delete data.completed[
                        key
                    ];

                    saveData();

                    renderExtras();

                };


            container.appendChild(item);

        }
    );


    updateExtraProgress();

}


/* -----------------------------
   PROGRESSO EXTRAS
----------------------------- */

function updateExtraProgress() {

    const date =
        getDateKey();


    const extras =
        data.extras[date] || [];


    if (!extras.length) {

        setProgress(
            "extra",
            0
        );

        return;

    }


    let completed = 0;


    extras.forEach(extra => {

        const key =
            `${date}_extra_${extra.id}`;


        if (data.completed[key]) {

            completed++;

        }

    });


    const percentage =
        Math.round(
            completed /
            extras.length *
            100
        );


    setProgress(
        "extra",
        percentage
    );

}


/* -----------------------------
   LEMBRETES
----------------------------- */

function addReminder() {

    const input =
        document.getElementById(
            "reminderInput"
        );


    const text =
        input.value.trim();


    if (!text) return;


    data.reminders.push({

        id: Date.now(),

        text: text

    });


    input.value = "";


    saveData();

    renderReminders();

}


/* -----------------------------
   RENDER LEMBRETES
----------------------------- */

function renderReminders() {

    const container =
        document.getElementById(
            "reminderList"
        );


    container.innerHTML = "";


    if (!data.reminders.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhum lembrete cadastrado.
            </div>
        `;

        return;

    }


    data.reminders.forEach(
        (reminder, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "reminder-item";


            item.innerHTML = `

                <span>
                    🔔
                    ${escapeHTML(
                        reminder.text
                    )}
                </span>


                <button
                    class="delete-btn"
                >
                    ×
                </button>

            `;


            item.querySelector(
                ".delete-btn"
            ).onclick = () => {

                data.reminders.splice(
                    index,
                    1
                );

                saveData();

                renderReminders();

            };


            container.appendChild(item);

        }
    );

}


/* -----------------------------
   METAS
----------------------------- */

function addGoal() {

    const input =
        document.getElementById(
            "goalInput"
        );


    const text =
        input.value.trim();


    if (!text) return;


    data.goals.push({

        id: Date.now(),

        text: text,

        completed: false

    });


    input.value = "";


    saveData();

    renderGoals();

}


/* -----------------------------
   RENDER METAS
----------------------------- */

function renderGoals() {

    const container =
        document.getElementById(
            "goalList"
        );


    container.innerHTML = "";


    if (!data.goals.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma meta cadastrada.
            </div>
        `;

        updateGoalPercentage();

        return;

    }


    data.goals.forEach(
        (goal, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "goal-item";


            if (goal.completed) {

                item.classList.add(
                    "completed"
                );

            }


            item.innerHTML = `

                <input
                    type="checkbox"
                    ${goal.completed
                        ? "checked"
                        : ""}
                >


                <span>
                    ${escapeHTML(
                        goal.text
                    )}
                </span>


                <button
                    class="delete-btn"
                >
                    ×
                </button>

            `;


            item.querySelector(
                "input"
            ).onchange = event => {

                data.goals[index]
                    .completed =
                    event.target.checked;


                saveData();

                renderGoals();

            };


            item.querySelector(
                ".delete-btn"
            ).onclick = () => {

                data.goals.splice(
                    index,
                    1
                );

                saveData();

                renderGoals();

            };


            container.appendChild(item);

        }
    );


    updateGoalPercentage();

}


/* -----------------------------
   PORCENTAGEM METAS
----------------------------- */

function updateGoalPercentage() {

    if (!data.goals.length) {

        document.getElementById(
            "goalPercentage"
        ).textContent = "0%";

        return;

    }


    const completed =
        data.goals.filter(
            goal =>
                goal.completed
        ).length;


    const percentage =
        Math.round(
            completed /
            data.goals.length *
            100
        );


    document.getElementById(
        "goalPercentage"
    ).textContent =
        `${percentage}%`;

}


/* -----------------------------
   SEMANA
----------------------------- */

function getDayPerformance(
    dayIndex
) {

    const today =
        new Date();


    const currentDay =
        today.getDay();


    let difference =
        dayIndex -
        (currentDay === 0
            ? 6
            : currentDay - 1);


    const date =
        new Date();


    date.setDate(
        today.getDate() +
        difference
    );


    const dateKey =
        getDateKey(date);


    const dayName =
        days[dayIndex];


    const routines =
        data.routine[dayName]
        || [];


    let routineCompleted = 0;


    routines.forEach(
        (_, index) => {

            const key =
                `${dateKey}_routine_${dayName}_${index}`;


            if (data.completed[key]) {

                routineCompleted++;

            }

        }
    );


    const routinePercentage =
        routines.length
            ? routineCompleted /
              routines.length *
              100
            : 0;


    const extras =
        data.extras[dateKey]
        || [];


    let extrasCompleted = 0;


    extras.forEach(extra => {

        const key =
            `${dateKey}_extra_${extra.id}`;


        if (data.completed[key]) {

            extrasCompleted++;

        }

    });


    const extraPercentage =
        extras.length
            ? extrasCompleted /
              extras.length *
              100
            : 0;


    if (
        !routines.length &&
        !extras.length
    ) {

        return 0;

    }


    if (!routines.length) {

        return extraPercentage;

    }


    if (!extras.length) {

        return routinePercentage;

    }


    return (
        routinePercentage +
        extraPercentage
    ) / 2;

}


/* -----------------------------
   GRÁFICO SEMANAL
----------------------------- */

function updateWeeklyProgress() {

    const chart =
        document.getElementById(
            "weekChart"
        );


    chart.innerHTML = "";


    let total = 0;


    days.forEach(
        (day, index) => {

            const percentage =
                Math.round(
                    getDayPerformance(
                        index
                    )
                );


            total += percentage;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "week-day";


            item.innerHTML = `

                <div class="chart-value">
                    ${percentage}%
                </div>


                <div class="chart-area">

                    <div
                        class="chart-bar"
                        style="
                            height:
                            ${Math.max(
                                percentage,
                                5
                            )}%
                        "
                    ></div>

                </div>


                <strong>
                    ${shortDays[index]}
                </strong>

            `;


            chart.appendChild(item);

        }
    );


    const average =
        Math.round(
            total /
            days.length
        );


    document.getElementById(
        "weekTotal"
    ).textContent =
        `${average}%`;

}


/* -----------------------------
   FRASES
----------------------------- */

const motivationalPhrases = [

    "Você não precisa fazer tudo de uma vez. Só precisa dar o próximo passo. 🌷",

    "Pequenos hábitos repetidos todos os dias constroem grandes resultados. ✨",

    "Disciplina também é uma forma de carinho com os seus sonhos. 💜",

    "Não precisa ser perfeito. Precisa continuar. 💙",

    "A Janaina de amanhã agradece pelas escolhas que você faz hoje. 🌟",

    "Seu progresso merece ser comemorado, mesmo quando parece pequeno.",

    "Organizar sua rotina é organizar espaço para aquilo que realmente importa."

];


function updatePhrase() {

    const day =
        new Date().getDate();


    const phrase =
        motivationalPhrases[
            day %
            motivationalPhrases.length
        ];


    document.getElementById(
        "motivationalPhrase"
    ).textContent =
        phrase;

}


/* -----------------------------
   SEGURANÇA HTML
----------------------------- */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* -----------------------------
   INICIALIZAÇÃO
----------------------------- */

function renderAll() {

    updateGreeting();

    renderDays();

    renderRoutine();

    renderExtras();

    renderReminders();

    renderGoals();

    updateWeeklyProgress();

    updatePhrase();

}


renderAll();


/* Atualiza saudação caso o app
   fique aberto por muito tempo */

setInterval(
    updateGreeting,
    60000
);


if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("App instalado com sucesso!");
            })
            .catch(error => {
                console.log("Erro:", error);
            });

    });

}