export const getReadableStream = (body: ReadableStream<Uint8Array> | null) => {
  return new Promise((resolve) => {
    const textDecoder = new TextDecoder();

    const reader = body?.getReader();

    let responseValue = "";

    new ReadableStream({
      start(controller) {
        function push() {
          reader?.read().then(({ done, value }) => {
            responseValue += textDecoder.decode(value);
            if (done) {
              controller.close();
              resolve(responseValue);
              return;
            }

            controller.enqueue(value);
            push();
          });
        }
        push();
      },
    });
  });
};
