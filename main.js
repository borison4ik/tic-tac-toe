window.addEventListener('load', function () {
  // нахожу элементы DOM и обьявляю переменные
  const area = document.querySelector('.area');
  const reset = document.getElementById('new');
  const input = document.getElementById('quantityLines');
  const stepView = document.getElementById('step');
  const playerView = document.getElementById('player');
  const statView = document.getElementById('stat');
  const winnerView = document.getElementById('winner');
  const popup = document.querySelector('.popup');
  const closePopup = document.getElementById('closePopup');

  // получаю колисество клеток в поле, объявляю массив для хранения матрицы поля, обьявляю первого игрока 'x' и остальные переменные
  let q = input.value;
  let map = [];
  let player = null;
  let winner = false;
  let step = 0;
  let games = [];

  // запускаю игру при загрузке страницы
  newGame();

  // добавляю лисенер на кнопку начала новой игры, передаю в него функцию newGame
  reset.addEventListener('click', newGame);

  console.log(map);

  closePopup.addEventListener('click', function () {
    if (popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  });

  // функция начала новой игры
  function newGame() {
    // объявляю переменные новой игры
    player = 'x';
    step = 0;
    q = input.value;
    // вызываю функцию создания игрового поля и передаю в нее нужное количество полей
    makeMap(q);
    // вызываю функцию отририсовки игрового поля
    drawMap(map);

    stepView.innerHTML = ++step;
    playerView.innerHTML = player;

    // добавляю лисенер клика по игровому полю и передаю в него фупкцию следующего хода игры gameStep, 1 клик - 1 ход
    area.addEventListener('click', gameStep);
  }

  // функция остановки игры
  // вывожу победителя и снимаю лисенер с игрового поля, ходы больше сделать нельзя
  function stopGame() {
    area.removeEventListener('click', gameStep);
    updateStat(player, step, winner);
    drawStat(games);
    winnerView.innerHTML = `победил игрок: ${player}`;
    popup.classList.add('open');
  }

  // функция хода игры
  function gameStep(e) {
    console.clear();
    // получаю актуальную нажатую ячейку из обьекта event
    let cell = e.target;
    //  проверяю если нажата действительно ячейка игрового поля содержащая в себе класс 'cell' и она пустая то разрешаю сделать ход
    if (cell.classList.contains('cell') && cell.innerHTML == '') {
      // получаю позицию выбранной игроком ячейки из атрибутов созданных на основе позиции в матрице массива map
      let col = cell.getAttribute('col');
      let row = cell.getAttribute('row');
      // передаю данные о позиции ячейки в функцию для обновления матрицы поля и вызываю ее
      updateMap(col, row);
      // и перерисовываю игровое поле с учетом внесенных в матрицу изменений
      drawMap(map);
      // проверяю не выиграл ли активный игрок
      if (checkWinner(player)) {
        winner = true;
        // вызываю функцию остановки игры
        stopGame();
        return;
      }
      // если победителя нет передаю ход другому игроку
      player = player === 'x' ? 'o' : 'x';
      playerView.innerHTML = player;
      stepView.innerHTML = ++step;
    } else {
      // вывожу сообщение о том что нажата ячейка в которую уже походили
      alert('ячейка занята');
    }
    console.log(map);
  }

  // проверяю условие на текущеко игрока по заполнению диагоналей, строк или столбцов
  function checkWinner(player) {
    // если одна из функций проверки вернет true найден победитель - возвращаю true
    return checkLines(player) || checkDiagonales(player);
  }

  // перебираю матрицу массивов и проверяю диагонали их всегда только 2
  function checkDiagonales(player) {
    // изначально объявляю переменные обеих диагоналей как истину
    let lr = true;
    let rl = true;
    // диагональ слева направо имеет одинаковые индексы для ячеек массива перебираю циклом
    // проверяю соответствует ли ячейка игроку если это так то условие вернет true && true что в свою очередь вернет true в переменную
    // если ячейка пустая null или занята другим игроком условие вернет true && false что равняется false
    for (let i = 0; i < map.length; i++) {
      lr = lr && map[i][i] === player;
    }
    // тоже самое для диагонали справа налево
    for (let i = 1; i <= map.length; i++) {
      rl = rl && map[i - 1][map.length - i] === player;
    }
    // если хотябы одна диагонать вернет true возвращаем true
    return rl || lr;
  }

  function checkLines(player) {
    // проверяю горизонтальные линии начиная с верху вниз и вертикальные слева напрво
    for (let i = 0; i < map.length; i++) {
      // объявляю переменные для каждой линии и каждой колонки как true перед началом второго цикла
      // если объявить переменные выше блочной видимости цикла то после первой неудачной итерации переменная останется false
      // что сломает нашу проверку на вечный false
      let lv = true;
      let lh = true;
      // перебираю матрицу массивов и сравниваю заполненны ли все массивы = строки символом игрока
      for (let j = 0; j < map.length; j++) {
        // та же логика что и для диагоналей
        // беру массивы по порядку перебираю записываю результат для строк в переменную
        lh = lh && map[i][j] === player;
        // перебираю столбцы, беру из всех массивов элемент под одним и тем же индексом
        lv = lv && map[j][i] === player;
      }
      // если хотябы одна строка или один столбец вернет true возвращаем true и прирываем дальнейшее выполнение функции
      if (lh || lv) {
        return true;
      }
    }
    // если проверки не вернули true и выполнение дошло до этой строчки возвращяем false
    return false;
  }

  // функция создания мартицы из массивов для хранения данных об игровом поле
  // принимает на вход количество ячеек в поле по горихонтали или вертикали
  // поскольку игра идет всегда на квадратном поле это не важно
  function makeMap(q) {
    // обнуляю массив поля
    map = [];
    // через цикл создаю новый массив наполняю его значениями null и пушу в map
    // получаем матрицу из масивов нужного размера
    for (let i = 0; i < q; i++) {
      let lineMap = [];
      // дочерние массивы имеют длинну заданую игроком
      for (let j = 0; j < q; j++) {
        lineMap.push(null);
      }
      // количество добавленных массивов так же равно количеству указанных игроком ячеек
      map.push(lineMap);
    }
  }

  // функция отрисовки игрового поля пользователю
  function drawMap(map) {
    // очищаю объект поля
    area.innerHTML = '';
    // добавляю стили для ширины поля исходя из количества ячеек
    area.style.width = map.length * 30 + 'px';
    // перебираю матрицу и добавляю ячейки на поле
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        // добавляю нужные для оформления классы и атрибуты с положением ячейки в матрице игрового поля
        cell.setAttribute('col', j);
        cell.setAttribute('row', i);
        // записываю внутрь ячейки данные из матрицы
        cell.innerHTML = map[i][j];
        // добавляю ячейку на игровое поле
        area.appendChild(cell);
      }
    }
  }

  function updateStat(player, step, winner) {
    if (winner) {
      const game = {
        step: step,
        winner: player,
      };
      games.push(game);
    }

    console.log(games);
  }

  function drawStat(games) {
    statView.innerHTML = '';
    if (games.length) {
      for (let i = 0; i < games.length; i++) {
        let li = document.createElement('li');
        li.classList.add('stat-item');
        li.innerHTML = `#${i + 1} | победа игрока: ${games[i].winner} | на ${games[i].step} ходу`;
        statView.appendChild(li);
      }
    }
  }

  // функция обновления данных в матрице принимает индексы строки и столбца
  function updateMap(col, row) {
    // находим нужный элемент матрицы по индексам и обновляем значение
    map[row][col] = player;
  }
});
