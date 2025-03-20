document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const applyButton = document.getElementById('applyButton');
    const output = document.getElementById('output');

    let letters = [];
    let selectedLetters = new Set();
    let isDragging = false;
    let rectSelection = null;
    let isCtrlPressed = false;

    // Додавання тексту
    applyButton.addEventListener('click', function () {
        output.innerHTML = '';
        letters = [];
        selectedLetters.clear();

        const text = inputText.value;
        text.split('').forEach((char, index) => {
            const letter = document.createElement('div');
            letter.textContent = char;
            letter.classList.add('letter');
            letter.dataset.index = index;
            letter.style.left = `${index * 30}px`;
            letter.style.position = 'absolute';
            output.appendChild(letter);
            letters.push(letter);

            // Обробка кліків для виділення
            letter.addEventListener('mousedown', function (e) {
                if (e.ctrlKey || e.metaKey) {
                    letter.classList.toggle('selected');
                    if (letter.classList.contains('selected')) {
                        selectedLetters.add(letter);
                    } else {
                        selectedLetters.delete(letter);
                    }
                } else {
                    // Початок переміщення
                    isDragging = true;
                    selectedLetters.clear();
                    selectedLetters.add(letter);
                    letter.classList.add('dragging');
                }
                e.preventDefault();
            });
        });
    });

    // Переміщення літер
    document.addEventListener('mousemove', function (e) {
        if (isDragging && selectedLetters.size > 0) {
            // Переміщення усіх вибраних літер
            selectedLetters.forEach(letter => {
                letter.style.left = `${e.clientX - output.getBoundingClientRect().left}px`;
                letter.style.top = `${e.clientY - output.getBoundingClientRect().top}px`;
            });
        }
    });

    // Зупинка переміщення
    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            selectedLetters.forEach(letter => {
                letter.classList.remove('dragging');
            });
        }
    });

    // Виділення прямокутником
    output.addEventListener('mousedown', function (e) {
        if (!e.target.classList.contains('letter') && !isCtrlPressed) {
            rectSelection = document.createElement('div');
            rectSelection.classList.add('rect-selection');
            output.appendChild(rectSelection);

            const startX = e.clientX - output.getBoundingClientRect().left;
            const startY = e.clientY - output.getBoundingClientRect().top;

            rectSelection.style.left = `${startX}px`;
            rectSelection.style.top = `${startY}px`;

            const onMouseMove = function (e) {
                const endX = e.clientX - output.getBoundingClientRect().left;
                const endY = e.clientY - output.getBoundingClientRect().top;

                rectSelection.style.width = `${Math.abs(endX - startX)}px`;
                rectSelection.style.height = `${Math.abs(endY - startY)}px`;
                rectSelection.style.left = `${Math.min(startX, endX)}px`;
                rectSelection.style.top = `${Math.min(startY, endY)}px`;

                // Виділення літер у прямокутнику
                letters.forEach(letter => {
                    const rect = letter.getBoundingClientRect();
                    const selectionRect = rectSelection.getBoundingClientRect();
                    if (
                        rect.left < selectionRect.right &&
                        rect.right > selectionRect.left &&
                        rect.top < selectionRect.bottom &&
                        rect.bottom > selectionRect.top
                    ) {
                        letter.classList.add('selected');
                        selectedLetters.add(letter);
                    } else {
                        letter.classList.remove('selected');
                        selectedLetters.delete(letter);
                    }
                });
            };

            const onMouseUp = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (rectSelection) {
                    rectSelection.remove();
                    rectSelection = null;
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Control' || e.key === 'Meta') {
            isCtrlPressed = true;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Control' || e.key === 'Meta') {
            isCtrlPressed = false;
        }
    });
});
