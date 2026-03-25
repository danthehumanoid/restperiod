// ambient-mixer-processor.js

/**
 * Custom AudioWorkletProcessor that simply mixes multiple inputs.
 * This is used to force iOS to recognize the ambient tracks as an active
 * background audio stream separate from the main JavaScript thread.
 */
class AmbientMixerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.inputCount = 0;
    }

    /**
     * Called by the Web Audio API to process audio chunks.
     */
    process(inputs, outputs, parameters) {
        // inputs[i][j] is a 2D array: inputs[input_index][channel_index]
        const output = outputs[0];
        const input0 = inputs[0]; // Soundscape
        const input1 = inputs[1]; // Birds

        // If there are no inputs, fill the output with silence
        if (input0.length === 0 && input1.length === 0) {
            output.forEach(channel => channel.fill(0));
            return true;
        }

        // We assume stereo (2 channels) for simplicity
        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];
            const inputChannel0 = input0[channel];
            const inputChannel1 = input1[channel];

            if (!inputChannel0 && !inputChannel1) {
                outputChannel.fill(0); // Fill with silence if no audio data is available
                continue;
            }

            // Mix the input channels into the output channel
            for (let i = 0; i < outputChannel.length; i++) {
                let sample0 = inputChannel0 ? inputChannel0[i] : 0;
                let sample1 = inputChannel1 ? inputChannel1[i] : 0;

                // Simple additive mixing
                outputChannel[i] = sample0 + sample1; 
            }
        }

        // Return true to keep the processor alive and running
        return true;
    }
}

registerProcessor('ambient-mixer-processor', AmbientMixerProcessor);