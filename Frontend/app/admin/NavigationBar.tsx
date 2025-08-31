export const NavigationBar = () => {
  return (
    <header className="flex flex-wrap gap-5 justify-between py-4 pr-8 pl-4 w-full bg-white max-md:pr-5 max-md:max-w-full">
      <h1 className="my-auto text-lg font-semibold leading-loose text-black">
        Logo
      </h1>
      <nav className="flex gap-4">
        <button className="flex justify-center items-center p-2 rounded-md min-h-9">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/621a12dd23f869c922ace97148cb4069756752194fa4de5dec9af4e7e5819bb3?placeholderIfAbsent=true&apiKey=42aa05c6588b469b94e217730e390f0b"
            className="object-contain self-stretch my-auto w-5 aspect-square"
            alt="Navigation icon"
          />
        </button>
        <button className="flex justify-center items-center p-2 rounded-md min-h-9">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e39ff2eab2fca87962d6ef001f43735ea683f7c3d6a9416a5d9e6b42e8c1c14?placeholderIfAbsent=true&apiKey=42aa05c6588b469b94e217730e390f0b"
            className="object-contain self-stretch my-auto w-5 aspect-square"
            alt="Menu icon"
          />
        </button>
        <button className="flex justify-center items-center p-2 rounded-md min-h-9">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8b4d47ca5b59ef01bb0ec06a9f41c725b6344743306bc64e54baa45618a5ea5?placeholderIfAbsent=true&apiKey=42aa05c6588b469b94e217730e390f0b"
            className="object-contain self-stretch my-auto w-5 aspect-square"
            alt="Action icon"
          />
        </button>
      </nav>
    </header>
  );
};
