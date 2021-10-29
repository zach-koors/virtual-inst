/**
 *  StartAudioContext.js
 *  @author Yotam Mann
 *  @license http://opensource.org/licenses/MIT MIT License
 *  @copyright 2016 Yotam Mann
 */
(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory)
	 } else if (typeof module === "object" && module.exports) {
        module.exports = factory()
	} else {
		root.StartAudioContext = factory()
  }
}(this, function () {

	//TAP LISTENER/////////////////////////////////////////////////////////////

	/**
	 * @class  Listens for non-dragging tap ends on the given element
	 * @param {Element} element
	 * @internal
	 */
	var TapListener = function(element, context){

		this._dragged = false

		this._element = element

		this._bindedMove = this._moved.bind(this)
		this._bindedEnd = this._ended.bind(this, context)

		element.addEventListener("touchstart", this._bindedEnd)
		element.addEventListener("touchmove", this._bindedMove)
		element.addEventListener("touchend", this._bindedEnd)
		element.addEventListener("mouseup", this._bindedEnd)
	}

	/**
	 * drag move event
	 */
	TapListener.prototype._moved = function(e){
		this._dragged = true
	};

	/**
	 * tap ended listener
	 */
	TapListener.prototype._ended = function(context){
		if (!this._dragged){
			startContext(context)
		}
		this._dragged = false
	};

	/**
	 * remove all the bound events
	 */
	TapListener.prototype.dispose = function(){
		this._element.removeEventListener("touchstart", this._bindedEnd)
		this._element.removeEventListener("touchmove", this._bindedMove)
		this._element.removeEventListener("touchend", this._bindedEnd)
		this._element.removeEventListener("mouseup", this._bindedEnd)
		this._bindedMove = null
		this._bindedEnd = null
		this._element = null
	};

	//END TAP LISTENER/////////////////////////////////////////////////////////

	/**
	 * Plays a silent sound and also invoke the "resume" method
	 * @param {AudioContext} context
	 * @private
	 */
	function startContext(context){
		// this accomplishes the iOS specific requirement
		var buffer = context.createBuffer(1, 1, context.sampleRate)
		var source = context.createBufferSource()
		source.buffer = buffer
		source.connect(context.destination)
		source.start(0)

		// resume the audio context
		if (context.resume){
			context.resume()
		}
	}

	/**
	 * Returns true if the audio context is started
	 * @param  {AudioContext}  context
	 * @return {Boolean}
	 * @private
	 */
	function isStarted(context){
		 return context.state === "running"
	}

	/**
	 * Invokes the callback as soon as the AudioContext
	 * is started
	 * @param  {AudioContext}   context
	 * @param  {Function} callback
	 */
	function onStarted(context, callback){

		function checkLoop(){
			if (isStarted(context)){
				callback()
			} else {
				requestAnimationFrame(checkLoop)
				if (context.resume){
					context.resume()
				}
			}
		}

		if (isStarted(context)){
			callback()
		} else {
			checkLoop()
		}
	}

	/**
	 * Add a tap listener to the audio context
	 * @param  {Array|Element|String|jQuery} element
	 * @param {Array} tapListeners
	 */
	function bindTapListener(element, tapListeners, context){
		if (Array.isArray(element) || (NodeList && element instanceof NodeList)){
			for (var i = 0; i < element.length; i++){
				bindTapListener(element[i], tapListeners, context)
			}
		} else if (typeof element === "string"){
			bindTapListener(document.querySelectorAll(element), tapListeners, context)
		} else if (element.jquery && typeof element.toArray === "function"){
			bindTapListener(element.toArray(), tapListeners, context)
		} else if (Element && element instanceof Element){
			//if it's an element, create a TapListener
			var tap = new TapListener(element, context)
			tapListeners.push(tap)
		} 
	}

	/**
	 * @param {AudioContext} context The AudioContext to start.
	 * @param {Array|String|Element|jQuery=} elements For iOS, the list of elements
	 *                                               to bind tap event listeners
	 *                                               which will start the AudioContext. If
	 *                                               no elements are given, it will bind
	 *                                               to the document.body.
	 * @param {Function=} callback The callback to invoke when the AudioContext is started.
	 * @return {Promise} The promise is invoked when the AudioContext
	 *                       is started.
	 */
	function StartAudioContext(context, elements, callback){

		//the promise is invoked when the AudioContext is started
		var promise = new Promise(function(success) {
			onStarted(context, success)
		})

		// The TapListeners bound to the elements
		var tapListeners = []

		// add all the tap listeners
		if (!elements){
			elements = document.body
		}
		bindTapListener(elements, tapListeners, context)

		//dispose all these tap listeners when the context is started
		promise.then(function(){
			for (var i = 0; i < tapListeners.length; i++){
				tapListeners[i].dispose()
			}
			tapListeners = null

			if (callback){
				callback()
			}
		})

		return promise
	}

	return StartAudioContext
}))

$(document).ready(function() {

  //the function that enables the rhythmic step buttons to cycle through states when clicked
  $(".rhythmic.step").click(function() {
    let stepClasses = [
      'rhythmic step on',
      'rhythmic step on-loud',
      'rhythmic step off'
    ];
    $(this).each(function() {
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });

  //the function that enables the melodic step buttons to cycle through pitches/states when clicked
  $(".melodic.step").click(function() {
    let melodicNote = ['0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '•'
    ];
    $(this).each(function() {
      this.textContent = melodicNote[($.inArray(this.textContent, melodicNote)+1)%melodicNote.length];
    });


    let stepClasses = [
      'melodic step on 0',
      'melodic step on 1',
      'melodic step on 2',
      'melodic step on 3',
      'melodic step on 4',
      'melodic step on 5',
      'melodic step on 6',
      'melodic step on 7',
      'melodic step on 8',
      'melodic step on 9',
      'melodic step off'
    ];
    $(this).each(function() {
      this.className = stepClasses[($.inArray(this.className, stepClasses)+1)%stepClasses.length];
    });
  });


  function sequencer() {

    //the instrument/player constants
    const kick = new Tone.Player("./sounds/kick2.wav").toDestination();
    const snare = new Tone.Player("./sounds/snare2.wav").toDestination();
    const hihat = new Tone.Player("./sounds/hihat2.wav").toDestination();
    const bass = new Tone.Player("./sounds/bass2.wav").toDestination();

    let i = 0;

    //the function that is executed on each step of the sequence
    function loopThroughSteps() {
      let step = i % 8;

      let kickStep = $(".kick .step:nth-child(" + (step+1) + ")");
      if(kickStep.hasClass("on")){
        kick.volume.value = -12;
        kick.stop();
        kick.start();
      }
      if(kickStep.hasClass("on-loud")){
        kick.volume.value = 0;
        kick.stop();
        kick.start();
      }

      let snareStep = $(".snare .step:nth-child(" + (step+1) + ")");
      if(snareStep.hasClass("on")){
        snare.volume.value = -12;
        snare.stop();
        snare.start();
      }
      if(snareStep.hasClass("on-loud")){
        snare.volume.value = 0;
        snare.stop();
        snare.start();
      }

      let hihatStep = $(".hi-hat .step:nth-child(" + (step+1) + ")");
      if(hihatStep.hasClass("on")){
        hihat.volume.value = -12;
        hihat.stop();
        hihat.start();
      }
      if(hihatStep.hasClass("on-loud")){
        hihat.volume.value = 0;
        hihat.stop();
        hihat.start();
      }

      console.log(step);
      i++;
    }

    function startTransport() {
      Tone.Transport.start();
      console.log("Transport started");
    }

    function stopTransport() {
      Tone.Transport.stop();
      console.log("Transport stopped");
    }

    //defining that the transport will loop through 8 steps
    Tone.Transport.scheduleRepeat(loopThroughSteps, "8n");
  
    
    //play button starts/stops the transport
    $("#play").click(function(){
      if ($(this).hasClass('text-secondary')){
        startTransport();
        $(this).removeClass('text-secondary').addClass('text-white');
      } else {
        stopTransport();
        $(this).removeClass('text-white').addClass('text-secondary');
      }
    });


    //when 16ths button is pressed, the steps are converted to 16th notes (double time)
    $("#time-signature").click(function(){
      if ($(this).hasClass('text-secondary')){
        Tone.Transport.bpm.value = Tone.Transport.bpm.value * 2;
        $(this).removeClass('text-secondary').addClass('text-white');
      } else {
        Tone.Transport.bpm.value = Tone.Transport.bpm.value / 2;
        $(this).removeClass('text-white').addClass('text-secondary');
      }
    });




    $("#tempo").click(function(){
      let tempoValues = [
        '144bpm',
        '160bpm',
        '180bpm',
        '72bpm',
        '90bpm',
        '108bpm',
        '120bpm'
      ];
      $(this).each(function(){
        this.textContent = tempoValues[($.inArray(this.textContent, tempoValues)+1)%tempoValues.length];
        Tone.Transport.bpm.value = parseInt(tempoValues[($.inArray(this.textContent, tempoValues))%tempoValues.length], 10);
        console.log(Tone.Transport.bpm.value + 'bpm');
      })
    });

  };

  sequencer();

});