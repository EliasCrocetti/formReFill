document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    const hideButton = document.getElementById('hideButton');
    const showButton = document.getElementById('showButton');
    const statusText = document.getElementById('statusText');
  
    addButton.addEventListener('click', function () {
      const inputName = prompt('Ingrese el nombre del nuevo input:');
      if (inputName) {
        // Enviamos un mensaje a content.js para que agregue el nuevo input con el name proporcionado
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'addInput', name: inputName });
        });
      }
    });
  
    hideButton.addEventListener('click', function () {
      // Ocultar los botones "Rellenar" y "Guardar" con la clase "classRefillForm"
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'hideButtons' });
      });
  
      // Guardar el estado como oculto en chrome.storage.sync
      chrome.storage.sync.set({ buttonsHidden: true });
  
      // Actualizar el texto del botón y el texto de estado
      hideButton.style.display = 'none';
      showButton.style.display = 'inline-block';
      statusText.textContent = 'Ocultos';
    });
  
    showButton.addEventListener('click', function () {
      // Mostrar los botones "Rellenar" y "Guardar" con la clase "classRefillForm"
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showButtons' });
      });
  
      // Guardar el estado como visible en chrome.storage.sync
      chrome.storage.sync.set({ buttonsHidden: false });
  
      // Actualizar el texto del botón y el texto de estado
      hideButton.style.display = 'inline-block';
      showButton.style.display = 'none';
      statusText.textContent = 'Mostrandose';
    });
  
    // Obtener el estado actual de los botones desde chrome.storage.sync
    chrome.storage.sync.get('buttonsHidden', function (result) {
      const buttonsHidden = result.buttonsHidden;
      if (buttonsHidden) {
        hideButton.style.display = 'none';
        showButton.style.display = 'inline-block';
        statusText.textContent = 'Ocultos';
      } else {
        hideButton.style.display = 'inline-block';
        showButton.style.display = 'none';
        statusText.textContent = 'Mostrandose';
      }
    });
  });
  