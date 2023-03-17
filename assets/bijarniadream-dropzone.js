
const dropzones = document.querySelectorAll('.dropzone');
let imagePaths = {};
dropzones.forEach(dropzone => {
  const input = dropzone.querySelector('input[type="file"]');
  const preview = dropzone.querySelector('.preview');
  const is_required = dropzone.querySelector('[data-required]');
  const is_multiple = dropzone.querySelector('[multiple]');
  const form = dropzone.closest('form');
  const inputName = input.getAttribute('name'); // get the input name attribute
  let resetBtn = "";
  let submitBtn = "";
  if(form) {
    resetBtn = form.querySelector('[type=reset]');
    submitBtn = form.querySelector('[type=submit]');
  }

  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dropzone-over');
  });

  dropzone.addEventListener('dragleave', e => {
    e.preventDefault();
    dropzone.classList.remove('dropzone-over');
  });

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dropzone-over');
    const files = e.dataTransfer.files;
    let filess = files;
    if (!is_multiple) {
      preview.innerHTML = "";
    }
    handleFiles(filess, preview, dropzone, input, form, inputName, is_required, is_multiple, resetBtn, submitBtn);
  });

  input.addEventListener('change', e => {
    const files = input.files;
    if (!is_multiple) {
      preview.innerHTML = "";
    }
    handleFiles(files, preview, dropzone, input, form, inputName, is_required, is_multiple, resetBtn, submitBtn);
  });
});

function handleFiles(files, preview, dropzone, input, form, inputName, is_required, is_multiple, resetBtn, submitBtn) {
  let fileLength = files.length;
  if(!is_multiple) {
    imagePaths[inputName] = [];
    fileLength = 1;
  }
  for (let i = 0; i < fileLength; i++) {
    const file = files[i];

    if (file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container","col-4");
      
      const imageContainerInner = document.createElement("div");
      imageContainerInner.classList.add("image-container-inner","position-relative");
                
      // const image = document.createElement("img");
      // image.src = e.target.result;

      const image = new Image();
      image.src = e.target.result;
      
        image.onload = function() {
          const previewImage = document.createElement("img");
          if((image.src).split(";")[0] == "data:image/gif"){
            previewImage.src = e.target.result;
          }else{
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = image.width;
            let height = image.height;
    
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
    
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width, height);
    
            const thumbnail = canvas.toDataURL(`image/png`);
            previewImage.src = thumbnail;
          }
  
          const removeButton = document.createElement("button");
          removeButton.classList.add("remove-image");
          removeButton.addEventListener("click", function() {
            imageContainer.remove();
            updateHiddenInput();
            if(form) {
              form.checkValidity();
            }
  
            let removeImageCount = 1;
            imagePaths[inputName] = imagePaths[inputName].filter(path => {
              if(removeImageCount==1 && path == e.target.result){
                removeImageCount++;
              }else{
                return path;
              }
            });
            if (preview.querySelectorAll('.image-container').length === 0) {
              dropzone.classList.remove('has-images');
              if (is_required) {
                input.required = true;
                
                if(form) {
                  if(submitBtn) {
                    submitBtn.disabled = true;
                  }
                }
              }
              
              input.value = '';
              
            }
            
  
            const imageContainers = preview.querySelectorAll('.image-container');
            updateHiddenInput();
            if(form) {
              form.checkValidity();
            }
            
            if (imagePaths.length === 0 && imageContainers.length === 0) {
              input.value = '';
            }
          });
  
          imageContainer.appendChild(imageContainerInner);
          
          imageContainerInner.appendChild(previewImage);
          imageContainerInner.appendChild(removeButton);
          preview.appendChild(imageContainer);
  
          dropzone.classList.add('has-images');
          
          input.required = false;
          if(form) {
            form.checkValidity();
          }
  
          
          if (!imagePaths[inputName]) {
            imagePaths[inputName] = [];
          }
          imagePaths[inputName].push(e.target.result);
          updateHiddenInput();
  
          
          console.log(`Image paths for ${inputName}:`, imagePaths[inputName]);
          
        }
      
    }

    reader.readAsDataURL(file);
    }
    else if (file.type.startsWith('video/')) {
      const videoContainer = document.createElement("div");
      videoContainer.classList.add("image-container","col-4");
      
      const videoContainerInner = document.createElement("div");
      videoContainerInner.classList.add("image-container-inner","position-relative","bg-light");
      
      const videoIcon = document.createElement("i");
      videoIcon.classList.add("otherFilesIcon");
      
      const videoText = document.createElement("i");
      videoText.classList.add("otherFilesName");
      let ext = (file.name).split(".");
      videoText.innerText = ext[ext.length - 1];
      
      const videoContainerBox = document.createElement("div");
      videoContainerBox.classList.add("image-container-box","position-relative", ext[ext.length - 1]);

      const videoName = document.createElement("span");
      videoName.classList.add("otherFilesName");
      videoName.innerText = file.name;

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-image");
      removeButton.addEventListener("click", function() {
        videoContainer.remove();
        imagePaths[inputName] = imagePaths[inputName].filter(path => path !== file.name);
        if (preview.querySelectorAll('.image-container').length === 0) {
          dropzone.classList.remove('has-images');
          if (is_required) {
            input.required = true;
            
            if(form) {
              if(submitBtn) {
                submitBtn.disabled = true;
              }
            }
          }
          
          input.value = '';
          
        }
        const videoContainers = preview.querySelectorAll('.image-container');
        updateHiddenInput();
        if(form) {
          form.checkValidity();
        }
          
        if (imagePaths.length === 0 && videoContainers.length === 0) {
          input.value = '';
        }
      });

      videoContainer.appendChild(videoContainerInner);
      videoContainerInner.appendChild(videoContainerBox);
      videoContainerBox.appendChild(videoIcon);
      videoContainerBox.appendChild(videoText);
      videoContainerInner.appendChild(videoName);
      videoContainerInner.appendChild(removeButton);
      preview.appendChild(videoContainer);

      dropzone.classList.add('has-images');
      
      input.required = false;
      if(form) {
        form.checkValidity();
      }

      if (!imagePaths[inputName]) {
        imagePaths[inputName] = [];
      }
      imagePaths[inputName].push(file.name);
      updateHiddenInput();

      console.log(`Video paths for ${inputName}:`, imagePaths[inputName]);
    }
    else {
      const otherFilesContainer = document.createElement("div");
      otherFilesContainer.classList.add("image-container","col-4");
      
      const otherFilesContainerInner = document.createElement("div");
      otherFilesContainerInner.classList.add("image-container-inner","position-relative","bg-light");

      const otherFilesIcon = document.createElement("i");
      otherFilesIcon.classList.add("otherFilesIcon");
      
      const otherFilesText = document.createElement("i");
      otherFilesText.classList.add("otherFilesName");
      let ext = (file.name).split(".");
      otherFilesText.innerText = ext[ext.length - 1];
      
      const otherFilesContainerBox = document.createElement("div");
      otherFilesContainerBox.classList.add("image-container-box","position-relative", ext[ext.length - 1]);

      const otherFilesName = document.createElement("span");
      otherFilesName.classList.add("otherFilesName");
      otherFilesName.innerText = file.name;

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-image");
      removeButton.addEventListener("click", function() {
        otherFilesContainer.remove();
        imagePaths[inputName] = imagePaths[inputName].filter(path => path !== file.name);
        if (preview.querySelectorAll('.image-container').length === 0) {
          dropzone.classList.remove('has-images');
          if (is_required) {
            input.required = true;
            
            if(form) {
              if(submitBtn) {
                submitBtn.disabled = true;
              }
            }
          }
          
          input.value = '';
          
        }
        const otherFilesContainers = preview.querySelectorAll('.image-container');
        updateHiddenInput();
        if(form) {
          form.checkValidity();
        }
          
        if (imagePaths.length === 0 && otherFilesContainers.length === 0) {
          input.value = '';
        }
      });

      otherFilesContainer.appendChild(otherFilesContainerInner);
      otherFilesContainerInner.appendChild(otherFilesContainerBox);
      otherFilesContainerBox.appendChild(otherFilesIcon);
      otherFilesContainerBox.appendChild(otherFilesText);
      otherFilesContainerInner.appendChild(otherFilesName);
      otherFilesContainerInner.appendChild(removeButton);
      preview.appendChild(otherFilesContainer);

      dropzone.classList.add('has-images');
      
      input.required = false;
      if(form) {
        form.checkValidity();
      }

      if (!imagePaths[inputName]) {
        imagePaths[inputName] = [];
      }
      imagePaths[inputName].push(file.name);
      updateHiddenInput();

      console.log(`otherFiles paths for ${inputName}:`, imagePaths[inputName]);
    }

  }

  if(resetBtn) {
  resetBtn.addEventListener("click", function() {
    dropzone.classList.remove('has-images');
    if (is_required) {
      input.required = true;
      
      if(form) {
        if(submitBtn) {
          submitBtn.disabled = true;
        }
      }
    }
    preview.innerHTML = "";
    imagePaths[inputName] = "";
    input.value = '';
    updateHiddenInput();
    if(form) {
      form.checkValidity();
    }
  });
  }

  function updateHiddenInput() {
    const hiddenInput = dropzone.querySelector('input[type="hidden"]');
    hiddenInput.value = JSON.stringify(imagePaths[inputName]);
    console.log(`Image paths for ${inputName}:`, imagePaths[inputName]);
  }

  if(form) {
    if (form.checkValidity()) {
      if(submitBtn) {
        submitBtn.disabled = false;
      }
    }
    form.classList.add('was-validated');
  }

}