var queueForRecognition = [];
var imgs = document.getElementsByTagName('img');

for(var i = 0; i < imgs.length; i++){
    console.log(imgs[i]);
    console.log(imgs[i].src.split('/').pop().split('.').pop().indexOf('jpg'));
    console.log(imgs[i].clientWidth > 50 && imgs[i].clientHeight > 50 && imgs[i].alt == "" && imgs[i].src.split('/').pop().split('.').pop().indexOf('jpg') == 0);
    if(imgs[i].clientWidth > 50 && imgs[i].clientHeight > 50 && imgs[i].alt == "" && imgs[i].src.split('/').pop().split('.').pop().indexOf('jpg') == 0){
        queueForRecognition.push(imgs[i]);
    }
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        canvas.getContext('2d').drawImage(this, 0, 0);
        callback(canvas.toDataURL('image/jpg').replace(/^data:image\/(png|jpg);base64,/, ''));
    };

    image.src = url;
}

console.log(queueForRecognition);

function recursiveImageRecognition(i){
    getDataUri(queueForRecognition[i].src, function(dataUri) {
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:9000/image/recognite', true);

        var imageData = {
            image : {
                name : queueForRecognition[i].src.split('/').pop(),
                body : dataUri
            }
        }

        xhr.send(imageData);
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
        
            if (xhr.status != 200) {    
                console.error(xhr.statusText);
            } else {
                res = JSON.parse(xhr.responseText);
                queueForRecognition[i].alt = res.recogniting_result[i].result;
                console.log(res);
                
            }
            // if(i < queueForRecognition.length){
            if(i < 2){
                recursiveImageRecognition(++i);
            }
        }

    });
}

if(queueForRecognition.length > 0){
    recursiveImageRecognition(0);
}