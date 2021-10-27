$(document).ready(function() {

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

  $(".melodic.step").click(function() {
    let melodicNote = ['0','1','2','3','4','5','6','7','8','9','•']
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
  const kick = new Tone.Player("./sounds/kick2.wav").toDestination();
  const snare = new Tone.Player("./sounds/snare2.wav").toDestination();
  const hihat = new Tone.Player("./sounds/hihat2.wav").toDestination();
  const bass = new Tone.Player("./sounds/bass2.wav").toDestination();

    let i = 0;

   function loopThroughSteps() {
    let step = i % 8;
    let kickStep = $(".kick .step:nth-child(" + (step+1) + ")");
    if(kickStep.hasClass("on")){
      kick.stop();
      kick.start();
    }

    console.log(step);

    i++;
  }

  Tone.Transport.scheduleRepeat(loopThroughSteps, "8n");
  Tone.Transport.stop();

}

  sequencer();

});