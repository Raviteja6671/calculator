  const display = document.getElementById('display');
        const buttonsContainer = document.getElementById('calculator-buttons');
        const modeButtons = document.querySelectorAll('.modes li');
        const themeSelect = document.getElementById('theme');
        const calculatorContainer = document.querySelector('.calculator-container');

        let currentMode = 'basic';
        let expression = "";

        const buttonsConfig = {
            basic: [
                'AC', '/', '%', '⌫',
                '7', '8', '9', '*',
                '4', '5', '6', '-',
                '1', '2', '3', '+',
                '0', '.', '='
            ],
            casio: [
                'AC', '√', '%', '/', '⌫',
                '7', '8', '9', '*', '^',
                '4', '5', '6', '-', '(',
                '1', '2', '3', '+', ')',
                '0', '.', '=', 'sin', 'cos',
                'tan'
            ]
        };

        function generateButtons(mode) {
            buttonsContainer.innerHTML = '';

            buttonsConfig[mode].forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn;

               
                if (['/', '*', '-', '+', '√', 'sin', 'cos', 'tan', '^', '%', '(', ')'].includes(btn)) {
                    button.classList.add('operator');
                } else if (btn === '=') {
                    button.classList.add('equals');
                } else if (btn === 'AC') {
                    button.classList.add('clear');
                } else if (btn === '⌫') {
                    button.classList.add('backspace');
                }

               
                button.addEventListener('click', () => handleInput(btn));
                buttonsContainer.appendChild(button);
            });

            calculatorContainer.setAttribute('data-mode', mode);
        }

        function handleInput(value) {
            if (value === 'AC') { // Clear all
                expression = '';
                display.value = '0';
            } else if (value === '⌫') { // Backspace - remove last character
                if (expression.length > 0) {
                    expression = expression.slice(0, -1);
                    display.value = expression || '0';
                }
            } else if (value === '=') {
                try {
                    let evalExpression = expression
                        .replace(/√(\d+)/g, 'Math.sqrt($1)')
                        .replace(/sin/g, 'Math.sin')
                        .replace(/cos/g, 'Math.cos')
                        .replace(/tan/g, 'Math.tan')
                        .replace(/\^/g, '**')
                        .replace(/%/g, '/100');

                    const result = Function('"use strict";return (' + evalExpression + ')')();
                    display.value = result;
                    expression = result.toString();
                } catch {
                    display.value = 'Error';
                    expression = '';
                }
            } else {
                if (display.value === '0' || display.value === 'Error') {
                    expression = value;
                    display.value = value;
                } else {
                    expression += value;
                    display.value = expression;
                }
            }
        }

        
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                currentMode = btn.dataset.mode;
                generateButtons(currentMode);

                expression = '';
                display.value = '0';
            });
        });

      
        themeSelect.addEventListener('change', () => {
            document.body.setAttribute('data-theme', themeSelect.value);
        });

       
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const allowedKeys = '0123456789+-*/().';

            if (allowedKeys.includes(key)) handleInput(key);
            else if (key === 'enter') handleInput('=');
            else if (key === 'backspace') {
                e.preventDefault(); // Prevent browser back navigation
                handleInput('⌫');
            } else if (key === 'escape') handleInput('AC');
            else if (key === '^') handleInput('^');
            else if (key === '%') handleInput('%');

            if (currentMode === 'casio') {
                if (key === 's') handleInput('sin');
                if (key === 'c') handleInput('cos');
                if (key === 't') handleInput('tan');
                if (key === 'r') handleInput('sqrt');
            }
        });

        // Initialize
        generateButtons(currentMode);