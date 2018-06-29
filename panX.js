class panX extends AudioWorkletProcessor {

  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [{ name: 'gain', defaultValue: 0 }];
  }

  constructor(dictionary) {
    super(dictionary);
    this._channelCount = dictionary.outputChannelCount;
  }

  //TODO
  //up mix mono signal to stereo
  process(inputs, outputs, parameters) {
    let input = inputs[0];
    let inputChannel = input[0];
    let output = outputs[0];

    let gain = parameters.gain;

    for (let channel = 0; channel < input.length; ++channel) {
      let rangePerSpeaker = 1.0 / input.length;
      let speaker = Math.floor(gain[0] / rangePerSpeaker);
      let nextSpeaker = speaker + 1;
      if (nextSpeaker == input.length) {
        nextSpeaker = -1;
      }

      let pan = gain[0] % rangePerSpeaker;
      pan = pan / rangePerSpeaker;

      let outputChannel = output[channel];
      if (channel == speaker) {
        if (pan == 0.0) {
          //do nothing
        } else {
          pan = 1.0 - pan;
        }
      }
      else if (channel == nextSpeaker) {
        //do nothing
      }
      else {
        pan = 0;
      }

      //write to 128 sample buffer:
      for (let i = 0; i < inputChannel.length; ++i) {
        outputChannel[i] = inputChannel[i] * pan;
      }
    }
    return true;
  }
}

registerProcessor('panX', panX);
