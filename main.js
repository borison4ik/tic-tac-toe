window.addEventListener("load", function(){
    // нахожу элементы DOM и обьявляю переменные
    let area = document.querySelector('.area');
    let reset = document.getElementById('new');
    let input = document.getElementById('quantityLines')
    // получаю колисество клеток в поле, объявляю массив для хранения матрицы поля, обьявляю первого игрока 'x'
    let q = input.value;
    let map = [];
    let player = 'x';

    // запускаю игру при загрузке страницы
    newGame();

    // добавляю лисенер на кнопку начала новой игры, передаю в него функцию newGame
    reset.addEventListener('click', newGame);

    console.log(map);





    // функция начала новой игры
    function newGame() {
        // объявляю переменные новой игры
        player = 'x';
        q = input.value;
        // вызываю функцию создания игрового поля и передаю в нее нужное количество полей
        makeMap(q);
        // вызываю функцию перирисовки игрового поля
        drawMap(map);
        // добавляю лисенер клика по игровому полю и передаю в него фупкцию следующего хода игры gameStap, 1 клик - 1 ход
        area.addEventListener('click', gameStap);
    }

    // функция остановки игры
    // вывожу победителя и снимаю лисенер с игрового поля, ходы больше сделать нельзя
    function stopGame(){
        area.removeEventListener('click', gameStap);
        console.log(`winner ${ player }`);
    }

    // функция хода игры
    function gameStap(e) {
        console.clear();
        // получаю актуальную нажатую ячейку из обьекта event 
        let cell = e.target;
        //  проверяю если нажата действительно ячейка игрового поля содержащая в себе класс 'cell' и она пустая то разрешаю сделать ход
        if (cell.classList.contains('cell') && cell.innerHTML == '') {
            // получаю позицыю выбранной играком ячейки из атрибутов созданных на основе позиции в матрице массива map
            let col = cell.getAttribute('col');
            let row = cell.getAttribute('row');
            // передаю данные о позиции ячейки в функцию для обновления матрицы поля
            updateMap(col, row);
            // и перерисовываю игровое поле с учетом внесенных в матрицу изменений
            drawMap(map);
            // проверяю не выиграл ли активный игрок
            checkWinner(player);
            // передаю ход другому игроку
            player = player === 'x' ? 'o' : 'x';

        } else {
            // вывожу сообщение о том что нажата ячейка в которую уже походили
            console.log('ячейка занята');
        }

        console.log(map);
    }
    // проверяю условие на текущеко игрока по заполнению диагоналей, строк или столбцов
    function checkWinner(player) {
        // если одна из функций проверки вернет true выиграл текущий игрок
        if (checkLines(player) || checkDiagonales(player)) {
            // вызываю функцию остановки игры
            stopGame();
        }

    }

    // перебираю матрицу массивов и проверяю диагонали их всегда только 2
    function checkDiagonales(player) {
        let lr = true;
        let rl = true;

        for (let i = 0; i < map.length; i++) {
            lr = lr && map[i][i] === player;
        }

        for (let i = 1; i <= map.length; i++) {
            rl = rl && map[i - 1][map.length - i] === player;
        }

        // console.log(lr);
        // console.log(rl);

        return rl || lr;

    }

    function checkLines(player) {

        
        // проверяю горизонтальные линии
        for (let i = 0; i < map.length; i++) {
            // объявляю переменную для каждой линии как true
            let lv = true;
            let lh = true;
            // перебираю матрицу массивов и сравниваю заполненны ли все массивы = строки символом игрока
            
            // и функция вернет false
            for (let j = 0; j < map.length; j++) {
                // если ячейка заполненна символом игрока переменные остается равной true если какая-то ячейка отличается переменные менят значение на false
                lh = lh && map[i][j] === player;
                lv = lv && map[j][i] === player;
            }

            if(lh || lv){
                return true;
            }
        }

        return false;

        // console.log(lh);
        // console.log(lv);
    }

    function makeMap(q) {
        map = [];

        for (let i = 0; i < q; i++) {
            let lineMap = [];

            for (let j = 0; j < q; j++) {
                lineMap.push(null);
            }
            
            map.push(lineMap);
        }
    }

    function drawMap(map) {
        area.innerHTML = '';
        area.style.width = map.length * 30 + 'px';

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('col', j);
                cell.setAttribute('row', i);
                cell.innerHTML = map[i][j];
                area.appendChild(cell);
                
            }
            
        }
    }

    function updateMap(col, row) {
        map[row][col] = player;
    }

});