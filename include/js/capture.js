;(function(document , window , undefined){
    window.onload = function(){
        init();
    };
    function init() {
        //Google Chrome要用webkitGetUserMedia
        navigator.webkitGetUserMedia({video : true}, success , error);

        var btn = document.getElementById('capture');

        btn.onclick = function(){
            shoot();
        };
    };
    function success(stream) {
        var myVideo = document.getElementById('scene'),
            att = document.createAttribute("src");
        att.value = window.webkitURL.createObjectURL(stream);
        myVideo.setAttributeNode(att);
    };

    function error(stream){
        console.log("error");
    };
    function shoot() {
        var video = document.getElementById("scene"),
            canvas = capture(video),
            result = document.getElementById('result');
        for(var x in result.childNodes){
            if(typeof(result.childNodes[x]) === "object"){
                result.removeChild(result.childNodes[x]);
            };
        };
        result.appendChild(canvas);
    };

    function capture(video) {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        return canvas;
    };
})(document , window);