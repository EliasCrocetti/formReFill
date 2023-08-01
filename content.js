let buttonsHidden = false;

function addButtonsToInputs() {
  const formInputs = document.querySelectorAll('input');

  formInputs.forEach((input) => {
    // Verificar si el input tiene el atributo data-type con valor "show"
    if (input.getAttribute('type') === 'hidden') {
      return; // Si es así, no agregamos los botones y pasamos al siguiente input
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'inline-block';

    const button = document.createElement('button');
    button.textContent = 'Rellenar';
    button.classList.add('classRefillForm'); // Agregar clase específica

    buttonContainer.appendChild(button);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';
    saveButton.classList.add('classRefillForm'); // Agregar clase específica

    buttonContainer.appendChild(saveButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('classRefillForm'); // Agregar clase específica

    buttonContainer.appendChild(deleteButton);

    input.insertAdjacentElement('afterend', buttonContainer);

    saveButton.addEventListener('click', () => {
      const inputName = input.getAttribute('name');
      const inputValue = input.value;

      // Utilizar chrome.storage para guardar el valor en la extensión
      chrome.storage.sync.set({ [inputName]: inputValue }, () => {
        console.log(`Valor ${inputValue} guardado para ${inputName}`);
      });
    });

    // Almacenar el nombre del input en una propiedad personalizada del botón "Rellenar"
    button.inputName = input.getAttribute('name');

    button.addEventListener('click', (event) => {
      // Evitar que el evento de clic predeterminado se ejecute
      event.preventDefault();

      // Utilizar el nombre almacenado en la propiedad personalizada del botón para obtener el valor almacenado
      const inputName = event.target.inputName;
      chrome.storage.sync.get([inputName], (result) => {
        const savedValue = result[inputName];
        if (savedValue) {
          input.value = savedValue;
        }
      });
    });

    deleteButton.addEventListener('click', () => {
      const inputName = input.getAttribute('name');

      // Eliminar el valor del input
      input.value = '';

      // Utilizar chrome.storage para eliminar el valor almacenado en la extensión
      chrome.storage.sync.remove(inputName, () => {
        console.log(`Valor eliminado para ${inputName}`);
      });
    });
  });

  // Resto del código...
}

// Ejecutar la función al cargar la página
addButtonsToInputs();

// Escuchar mensajes enviados desde popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'addInput') {
    // ... (resto del código)
  } else if (message.action === 'hideButtons') {
    // Ocultar los botones "Rellenar" y "Guardar" con la clase "classRefillForm"
    const buttons = document.querySelectorAll('.classRefillForm');
    buttons.forEach((button) => {
      button.style.display = 'none';
    });
    // Actualizar el estado a oculto
    buttonsHidden = true;
  } else if (message.action === 'showButtons') {
    // Mostrar los botones "Rellenar" y "Guardar" con la clase "classRefillForm"
    const buttons = document.querySelectorAll('.classRefillForm');
    buttons.forEach((button) => {
      button.style.display = 'inline-block';
    });
    // Actualizar el estado a mostrándose
    buttonsHidden = false;
  }
});
