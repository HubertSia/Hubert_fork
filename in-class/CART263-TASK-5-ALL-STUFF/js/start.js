window.onload = go_all_stuff;


// Declare globally so it's accessible in setupMicrophone()
let rectObj; 

function go_all_stuff() {
    console.log("go");

    /* for loading the video */
    let videoEl = document.getElementById("video-birds");
    window.addEventListener("click", function () {
        if (videoEl.currentTime === 0) {
            videoEl.play()
        }
    })


    videoEl.loop = true;

    let theCanvases = document.querySelectorAll(".canvases");
    let theContexts = [];
    //add a context for each canvas and put into an array

    for (let i = 0; i < theCanvases.length; i++) {
        let context = theCanvases[i].getContext("2d");
        theContexts.push(context);
    }

    let drawingBoardA = new DrawingBoard(theCanvases[0], theContexts[0], theCanvases[0].id);
    //add a circular object to canvas A
    drawingBoardA.addObj(new CircularObj(100, 100, 20, "#FFC300", "#E6E6FA", drawingBoardA.context))
    drawingBoardA.display();



    let drawingBoardB = new DrawingBoard(theCanvases[1], theContexts[1], theCanvases[1].id);
    //add a rectangular object to canvas B
    drawingBoardB.addObj(new RectangularObj(100, 100, 50, 70, "#FF5733", "#E6E6FA", drawingBoardB.context))
    drawingBoardB.display();


    let drawingBoardC = new DrawingBoard(theCanvases[2], theContexts[2], theCanvases[2].id);
    //add a freestyle object to canvas C
    drawingBoardC.addObj(new FreeStyleObj(10, 100, 300, "#CF9FFF", "#CF9FFF", drawingBoardC.context))
    drawingBoardC.display();

    let drawingBoardD = new DrawingBoard(theCanvases[3], theContexts[3], theCanvases[3].id);
    drawingBoardD.addObj(new VideoObj(0, 0, 400, 300, videoEl, drawingBoardD.context))
    drawingBoardD.display();


    /*** RUN THE ANIMATION LOOP  */
    window.requestAnimationFrame(animationLoop);

    function animationLoop() {
        /*** CALL THE EACH CANVAS TO ANIMATE INSIDE  */
        drawingBoardA.animate();
        drawingBoardB.animate();
        drawingBoardC.animate();
        drawingBoardD.run(videoEl)
        window.requestAnimationFrame(animationLoop);
    }



    /** TASK 1:(Drawing Board A) - 
     *  1: animate the circle object(s) somehow/anyhow.. (there may be more than one)
     * You can use the mouse coordinates - the canvas ALREADY has event listeners for mouse click and mouse move
     * implemeneted, as well as the proper mouseX and mouseY (NO need to add)
     * -> ensure that any properties that are changed by the circle object occur in the update method already provided,
     * and use the member properties provided (you may add new ones ... or not :)
     * 
     * 2: add new circle objects (different sizes, positions, colors) to the canvas (board A) using some form of user interaction
     * 3: remove new circle objects from the canvas (board A) using some other form of user interaction 
     * Please for this exercise - do not add any new shapes other than the circular object...
     * 
     */


    /** TASK 2:(Drawing Board B) - 
     *  1: Affect the rectangle by input from the microphone somehow, in real time...
     *  at least two properties of the rectangle need to update and change...
     *  2: apply some arbitrary animation to the rectangle obj (change the properties in the update method provided)
     * -> the code for the microphone has NOT been added  - you need to implement it correctly...
     *  
     */

// Asynchronous function to initialize microphone input and process audio data
async function setupMicrophone() {
    try {
        // Request access to the user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create an audio context for processing sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create an analyser node to extract audio features
        const analyser = audioContext.createAnalyser();
        
        // Create a media stream source from the microphone input
        const source = audioContext.createMediaStreamSource(stream);
        
        // Connect the source to the analyser
        source.connect(analyser);

        // Set FFT (Fast Fourier Transform) size for frequency analysis
        analyser.fftSize = 256;

        // Create a buffer to store frequency data
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Function to continuously update the visualization based on microphone input
        function updateFromMic() {
            // Get frequency data from the analyser
            analyser.getByteFrequencyData(dataArray);

            // Compute the average volume level
            let volume = dataArray.reduce((a, b) => a + b) / bufferLength;

            // Modify the visual representation based on volume
            if (rectObj) {
                // Adjust width dynamically with volume
                rectObj.width = 50 + volume * 2;  
                
                // Oscillate height slightly over time
                rectObj.height = 70 + Math.sin(Date.now() * 0.005) * 10;  
                
                // Adjust color intensity based on volume
                rectObj.fillColor = `rgb(${Math.min(255, volume * 3)}, 50, 100)`; 
            }

            // Continuously update the visualization
            requestAnimationFrame(updateFromMic);
        }

        // Start updating the visualization
        updateFromMic();
    } catch (err) {
        // Handle errors if microphone access is denied or unavailable
        console.error("Microphone access denied!", err);
    }
}

// Call the function to start microphone processing
setupMicrophone();


    /** TASK 3:(Drawing Board C) - 
     *  1: Affect the free-style shape by input from the microphone somehow, in real time...
     *  at least two properties of the free-style shape need to update and change...
     *  2: apply some arbitrary animation to the free-style shape (change the properties in the update method provided)
     * -> the code for the microphone has NOT been added  - you need to implement it correctly...
     *  
     */

    /** TASK 4:(Video - recorded - )
     * // add filters or manipulate the pixels... take user input from the boxes..
     *  1: using thr provided VideoObj class - > 
     * you will see all the code needed for activating  a blur filter on the video - activate it
     * 2: Next: apply the same logic to enable the other 3 possible filters (adding the event listeners etc)
     * -> make sure to look at the input/output ranges for the values
     * 3: -> apply the context filters  to the video for the three filter options (and activate the blur as well)
     * 4: ->  using the mousemove event listener (already applied in the drawing board) - 
     * make the rectangle (over the video) - follow the mouse ... AND change color when you click on the canvas
     * USE & FILL IN THE METHODS ALREADY set out in the VideoObj class...
     * 
     * 
     * PLEASE NOTE: there will be marks taken off if you ignore the instructions ;)
     *  
     */




}
