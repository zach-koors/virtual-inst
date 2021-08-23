function sequencer(){
  const kick = new Tone.Player("./sounds/kick.m4a").toMaster();
  const snare = new Tone.Player("./sounds/snare.m4a").toMaster();
  const hihat = new Tone.Player("./sounds/hihat.m4a").toMaster();
  let index = 0;

  const kickSteps = document.querySelectorAll(".k");
  const snareSteps = document.querySelectorAll(".s");
  const hihatSteps = document.querySelectorAll(".h");

  Tone.Trasnport.scheduleRepeat(repeat, "8n");
  function repeat(){
    let step = index % 8
  }

}
sequencer();
