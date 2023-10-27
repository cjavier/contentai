import * as React from "react";

export default function Landing() {
  return (
    <main className="items-center bg-slate-900 flex flex-col">
      <header className="self-center flex w-full max-w-screen-xl flex-col mt-6 max-md:max-w-full">
        <nav
          className="justify-between items-start shadow-[0px_0px_15px_0px_rgba(0,0,0,0.07),0px_25px_50px_-12px_rgba(0,0,0,0.25)] bg-white bg-opacity-10 self-center flex w-full max-w-[1000px] gap-5 px-5 py-6 rounded-3xl max-md:max-w-full max-md:flex-wrap"
          aria-label="Main Navigation"
        >
          <div className="items-start self-stretch flex w-[503px] max-w-full justify-between gap-5 pr-2 py-2 max-md:flex-wrap">
            <h1 className="text-white text-3xl font-bold leading-9 self-stretch">weeb</h1>
            <div className="items-start self-center flex w-[372px] max-w-full grow shrink-0 basis-auto justify-between gap-5 my-auto max-md:justify-center">
              <a href="#" className="text-white text-base font-medium leading-[150%] tracking-wide self-stretch">About Us</a>
              <a href="#" className="text-white text-base font-medium leading-[150%] tracking-wide self-stretch">Solutions</a>
              <a href="#" className="text-white text-base font-medium leading-[150%] tracking-wide self-stretch">Pricing</a>
              <a href="#" className="text-white text-base font-medium leading-[150%] tracking-wide self-stretch">Resources</a>
            </div>
          </div>
          <div className="items-start self-stretch flex w-[214px] max-w-full justify-between gap-5">
            <a href="#" className="text-white text-base font-medium leading-[150%] tracking-wide self-center my-auto">Log In</a>
            <a href="#" className="justify-center items-center border-[color:var(--purple-600,#9333EA)] bg-purple-600 self-stretch flex w-[127px] max-w-full flex-col px-5 py-3 rounded-lg border-2 border-solid">
              <span className="text-white text-base font-medium leading-[150%] tracking-wide self-center">Join Now</span>
            </a>
          </div>
        </nav>
      </header>
      <section className="items-center self-stretch flex grow flex-col mt-28 max-md:max-w-full">
        <div className="items-center self-stretch flex flex-col px-5 max-md:max-w-full">
          <h2 className="self-center text-purple-600 text-center text-7xl font-extrabold leading-[110%] w-[1280px] -ml-5 max-md:max-w-full max-md:text-4xl">
            <span className="text-white">Design Faster </span>
            <span className="text-purple-600">&</span>
            <span className="text-white"> Better</span>
          </h2>
          <p className="self-center text-white text-center text-lg leading-7 w-[1280px] -ml-5 mt-8 max-md:max-w-full">
            Sit elit feugiat turpis sed integer integer accumsan turpis. Sed suspendisse nec lorem mauris.
            <br />
            Pharetra, eu imperdiet ipsum ultrices amet, dui sit suspendisse.
          </p>
          <div className="justify-center items-start self-center flex w-[352px] max-w-full gap-4 mt-8">
            <a href="#" className="justify-center items-center border-[color:var(--purple-600,#9333EA)] bg-purple-600 self-stretch flex w-[168px] max-w-full flex-col px-5 py-4 rounded-lg border-2 border-solid">
              <span className="text-white text-xl font-medium leading-[120%] tracking-wide self-center">Join Now</span>
            </a>
            <a href="#" className="justify-center items-center border-[color:var(--White,#FFF)] self-stretch flex w-[168px] max-w-full flex-col px-5 py-4 rounded-lg border-2 border-solid">
              <span className="text-white text-xl font-medium leading-[120%] tracking-wide self-center">View Demo</span>
            </a>
          </div>
        </div>
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/26cd78f5-650c-4d7c-96bf-fb9cf4a719be?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.57] object-cover object-center w-full items-center shadow-[0px_0px_15px_0px_rgba(0,0,0,0.07),0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden self-center max-w-[1100px] grow mt-20 rounded-3xl max-md:max-w-full"
          alt="Design Image"
        />
      </section>
      <section className="items-center self-center flex w-full max-w-screen-xl flex-col mt-40 px-5 max-md:max-w-full">
        <h2 className="self-center text-white text-center text-6xl font-extrabold leading-[61.6px] w-[1280px] -ml-5 max-md:max-w-full max-md:text-4xl">Join Leading Companies</h2>
        <div className="justify-between items-start self-center flex w-full max-w-[1028px] gap-5 mt-20 max-md:max-w-full max-md:flex-wrap">
          <div className="justify-between items-start self-stretch flex gap-2">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4babffdd-a8e2-48d9-9598-8d8ffa6419eb?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.03] object-cover object-center w-[33px] overflow-hidden shrink-0" alt="Company Logo" />
            <div className="text-white text-2xl font-bold leading-7 self-center my-auto">SmartFinder</div>
          </div>
          <div className="justify-between items-start self-stretch flex gap-2">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/130f899b-5c4f-4d78-95b2-90c61221226c?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-8 fill-white overflow-hidden shrink-0" alt="Company Logo" />
            <div className="text-white text-2xl font-bold leading-7 self-center my-auto">Zoomerr</div>
          </div>
          <div className="justify-between items-start self-stretch flex gap-2">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/84e4564d-8434-40ce-8f5d-bc5627467fce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[0.94] object-cover object-center w-[30px] fill-white overflow-hidden shrink-0" alt="Company Logo" />
            <div className="text-white text-2xl font-bold leading-7 self-center my-auto">SHELLS</div>
          </div>
          <div className="justify-between items-start self-stretch flex gap-2">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9282087b-ce6f-43c0-a41f-7b8397879bbf?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[0.66] object-cover object-center w-[21px] fill-white overflow-hidden shrink-0" alt="Company Logo" />
            <div className="text-white text-2xl font-bold leading-7 self-center my-auto">WAVES</div>
          </div>
          <div className="justify-between items-start self-stretch flex gap-2">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ef415d77-5e8e-47f6-b00b-f32ffcb3ba9e?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.75] object-cover object-center w-14 overflow-hidden shrink-0" alt="Company Logo" />
            <div className="text-white text-2xl font-bold leading-7 self-center my-auto">ArtVenue</div>
          </div>
        </div>
      </section>
      <section className="self-center w-full max-w-[1255px] mt-40 px-5 max-md:max-w-full">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[68%] max-md:w-full">
            <div className="justify-center items-start flex grow flex-col mt-1 max-md:max-w-full max-md:mt-12">
              <div className="items-start self-stretch flex grow flex-col pb-4 max-md:max-w-full">
                <div className="items-start flex w-[800px] max-w-full flex-col">
                  <h3 className="self-stretch text-white text-xl font-bold leading-5 tracking-[3px] uppercase w-full max-md:max-w-full">Discover</h3>
                  <h2 className="self-stretch text-white text-7xl font-extrabold leading-[110%] w-full mt-4 max-md:max-w-full max-md:text-4xl">
                    <span className="text-purple-400">Unlimited</span>
                    <span className="text-white"> ideas for your next great projects </span>
                  </h2>
                </div>
                <p className="text-white text-lg leading-7 w-[800px] max-w-full mt-8">
                  Scelerisque auctor dolor diam tortor, fames faucibus non interdum nunc.
                  <br />
                  Ultrices nibh sapien elit gravida ac, rutrum molestie adipiscing lacinia.
                </p>
                <div className="justify-center items-start flex w-[178px] max-w-full gap-4 mt-12 rounded-lg">
                  <div className="text-white text-xl font-medium leading-[120%] tracking-wide self-center">Discover Ideas</div>
                  <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/6cb40404-f74e-485c-add6-f50761d80141?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Discover Icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[32%] ml-5 max-md:w-full">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/c7db6e75-fa93-4623-9c85-fde165d482f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[0.99] object-cover object-center w-full overflow-hidden grow max-md:mt-12" alt="Discover Image" />
          </div>
        </div>
      </section>
      <section className="self-center w-full max-w-screen-xl mt-40 px-5 max-md:max-w-full">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[38%] max-md:w-full">
            <div className="items-start self-stretch flex flex-col w-[450px] my-auto max-md:max-w-full max-md:mt-12">
              <div className="items-start self-stretch flex flex-col w-full max-md:max-w-full">
                <div className="self-stretch text-white text-xl font-bold leading-5 tracking-[3px] uppercase w-full">Powerful</div>
                <div className="self-stretch text-white text-6xl font-extrabold leading-[61.6px] w-full mt-4 max-md:text-4xl">All the tools you can imagine</div>
              </div>
              <p className="self-stretch text-white text-lg leading-7 w-full mt-8">
                Scelerisque auctor dolor diam tortor, fames faucibus non interdum nunc.
                Ultrices nibh sapien elit gravida ac, rutrum molestie adipiscing lacinia.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[63%] ml-5 max-md:w-full">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2af3742e-8e9b-424c-bacb-52b7eb17591f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.56] object-cover object-center w-full items-center shadow-[0px_0px_10px_0px_rgba(0,0,0,0.07),0px_20px_25px_-5px_rgba(0,0,0,0.10)] overflow-hidden grow rounded-3xl max-md:max-w-full max-md:mt-12" alt="Powerful Image" />
          </div>
        </div>
      </section>
      <section className="self-center w-full max-w-[1164px] mt-40 pr-3.5 max-md:max-w-full">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[76%] max-md:w-full">
            <div className="justify-center items-start flex grow flex-col max-md:max-w-full max-md:mt-12">
              <div className="items-start self-stretch flex grow flex-col pb-4 max-md:max-w-full">
                <div className="items-start flex w-[800px] max-w-full flex-col">
                  <h3 className="self-stretch text-white text-xl font-bold leading-5 tracking-[3px] uppercase w-full max-md:max-w-full">Customers</h3>
                  <h2 className="self-stretch text-white text-7xl font-extrabold leading-[110%] w-full mt-4 max-md:max-w-full max-md:text-4xl">
                    <span className="text-purple-400">Target</span>
                    <span className="text-white"> customers with our powerful AI kit </span>
                  </h2>
                </div>
                <p className="text-white text-lg leading-7 w-[800px] max-w-full mt-8">
                  Scelerisque auctor dolor diam tortor, fames faucibus non interdum nunc.
                  <br />
                  Ultrices nibh sapien elit gravida ac, rutrum molestie adipiscing lacinia.
                </p>
                <div className="justify-center items-start flex w-[348px] max-w-full gap-4 mt-12 rounded-lg">
                  <div className="text-white text-xl font-medium leading-[120%] tracking-wide max-w-[331px] self-stretch grow shrink-0 basis-auto">How Targeting Customers Works</div>
                  <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3d0154ae-65dc-4c89-b425-ea275ee0a3f9?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Targeting Icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[24%] ml-5 max-md:w-full">
            <div className="border-[color:var(--purple-900,#581C87)] flex w-64 h-64 flex-col m-auto border-[5px] border-solid max-md:mt-12" />
          </div>
        </div>
      </section>
      <section className="self-stretch flex w-full flex-col mt-40 max-md:max-w-full">
        <div className="self-center w-full max-w-screen-xl px-5 max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[38%] max-md:w-full">
              <div className="items-start self-stretch flex flex-col w-[450px] my-auto max-md:max-w-full max-md:mt-12">
                <div className="items-start self-stretch flex flex-col w-full max-md:max-w-full">
                  <div className="self-stretch text-white text-xl font-bold leading-5 tracking-[3px] uppercase w-full">Speed</div>
                  <div className="self-stretch text-white text-6xl font-extrabold leading-[61.6px] w-full mt-4 max-md:text-4xl">Work fast, w/o interruptions</div>
                </div>
                <p className="self-stretch text-white text-lg leading-7 w-full mt-8">
                  Scelerisque auctor dolor diam tortor, fames faucibus non interdum nunc.
                  Ultrices nibh sapien elit gravida ac, rutrum molestie adipiscing lacinia.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[63%] ml-5 max-md:w-full">
              <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/901d6a06-bb4b-4e56-aea4-8577c1fd0f20?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.56] object-cover object-center w-full items-center shadow-[0px_0px_10px_0px_rgba(0,0,0,0.07),0px_20px_25px_-5px_rgba(0,0,0,0.10)] overflow-hidden grow rounded-3xl max-md:max-w-full max-md:mt-12" alt="Speed Image" />
            </div>
          </div>
        </div>
      </section>
      <section className="items-center self-stretch bg-purple-900 flex w-full flex-col mt-20 px-5 py-10 max-md:max-w-full">
        <div className="self-center w-full max-w-screen-xl my-10 max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[34%] max-md:w-full">
              <div className="justify-center items-start flex flex-col my-auto max-md:mt-52">
                <div className="items-start self-stretch flex grow flex-col pb-3">
                  <div className="items-start flex w-[385px] max-w-full flex-col">
                    <div className="self-stretch text-white text-xl font-bold leading-5 tracking-[3px] uppercase w-full max-md:max-w-full">Testimonials</div>
                    <div className="self-stretch text-white text-6xl font-extrabold leading-[61.6px] w-full mt-4 max-md:text-4xl">Bigapp got to the next level</div>
                  </div>
                  <div className="justify-center items-start flex w-[167px] max-w-full gap-4 mt-11 rounded-lg">
                    <div className="text-white text-base font-medium leading-[150%] tracking-wide self-stretch w-[137px]">View Case Study</div>
                    <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/56c9744a-cc3d-4b47-9c1f-65092ec11e8a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Case Study Icon" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[32%] ml-5 max-md:w-full">
              <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/90b44e8b-867e-4b32-b006-f4c83949bb24?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[0.47] object-cover object-center w-full shadow-[0px_0px_15px_0px_rgba(0,0,0,0.07),0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden grow max-md:mt-12" alt="Testimonial Image" />
            </div>
            <div className="flex flex-col items-stretch w-[34%] ml-5 max-md:w-full">
              <div className="items-start flex flex-col w-[385px] my-auto max-md:mt-52">
                <p className="self-stretch text-white text-lg leading-7 w-full">“Viverra viverra nibh enim et aliquam, enim. Tempor, sit mus viverra orci dui consequat turpis scelerisque faucibus.”</p>
                <div className="items-start self-stretch flex justify-between gap-4 mt-4">
                  <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2665fc14-cc24-4aef-bb90-998e8feb7059?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-16 justify-center items-center overflow-hidden shrink-0" alt="Customer Avatar" />
                  <div className="items-start self-center flex flex-col grow shrink-0 basis-auto w-[305px] my-auto">
                    <div className="self-stretch text-white text-lg leading-7 w-full">Rwanda Melflor</div>
                    <div className="self-stretch text-white text-base leading-6 w-full">Co-founder Bigapp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="justify-center items-start border-t-[color:var(--blue-gray-300,#CBD5E1)] bg-white self-stretch flex w-full flex-col pb-10 px-5 border-t border-solid max-md:max-w-full">
        <div className="items-start self-center border-b-[color:var(--blue-gray-200,#E2E8F0)] flex w-full max-w-screen-xl flex-col py-10 border-b border-solid max-md:max-w-full">
          <div className="self-stretch my-2 max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[14%] max-md:w-full">
                <h1 className="text-slate-900 text-3xl font-bold leading-9 max-md:mt-12">weeb</h1>
              </div>
              <div className="flex flex-col items-stretch w-[86%] ml-5 max-md:w-full">
                <div className="grow mt-3 max-md:max-w-full max-md:mt-12">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-3/12 max-md:w-full">
                      <div className="items-start flex grow flex-col pr-5 pb-3 max-md:mt-12">
                        <div className="text-slate-400 text-base font-medium leading-4">PRODUCT</div>
                        <div className="items-start flex w-[90px] max-w-full flex-col mt-6">
                          <a href="#" className="text-slate-900 text-base leading-6">Pricing</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Overview</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Browse</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Accessibility</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Five</a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full">
                      <div className="items-start flex flex-col pr-5 pb-3 max-md:mt-12">
                        <div className="text-slate-400 text-base font-medium leading-4 uppercase">Solutions</div>
                        <div className="items-start flex w-[101px] max-w-full flex-col mt-6">
                          <a href="#" className="text-slate-900 text-base leading-6">Brainstorming</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Ideation</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Wireframing</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">
                            <ul>
                              <li>Research</li>
                            </ul>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full">
                      <div className="items-start flex flex-col pr-5 pb-3 max-md:mt-12">
                        <div className="text-slate-400 text-base font-medium leading-4 uppercase">Resources</div>
                        <div className="items-start flex w-[84px] max-w-full flex-col mt-6">
                          <a href="#" className="text-slate-900 text-base leading-6">Help Center</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Blog</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Tutorials</a>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full">
                      <div className="items-start flex flex-col pr-5 pb-3 max-md:mt-12">
                        <div className="text-slate-400 text-base font-medium leading-4 uppercase">Company</div>
                        <div className="items-start flex w-14 max-w-full flex-col mt-6">
                          <a href="#" className="text-slate-900 text-base leading-6">About</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Press</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">Events</a>
                          <a href="#" className="text-slate-900 text-base leading-6 mt-6">
                            <ul>
                              <li>Careers</li>
                            </ul>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="items-start self-center flex w-full max-w-screen-xl justify-between gap-5 mt-12 mb-2 max-md:max-w-full max-md:flex-wrap">
          <p className="text-slate-900 text-base leading-6 self-stretch max-w-[1127px] grow shrink-0 basis-auto mt-px max-md:max-w-full">
            @ 2023 Weeb, Inc. All rights reserved.
          </p>
          <div className="items-start self-stretch flex gap-4 max-md:justify-center">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/88c9b852-c082-4284-b02e-9913aa355ed4?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Social Media Icon" />
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/379a6d7c-4c7e-4ef1-9c42-2f14e2a81dd8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Social Media Icon" />
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/6023af6d-63ba-47e6-bd70-8374429c8086?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Social Media Icon" />
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/b30eca63-a82f-40e2-922c-e770ca3d9c1d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Social Media Icon" />
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/556b04c5-4c80-414c-9b02-8c3bc9e36d5f?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-square object-cover object-center w-6 overflow-hidden shrink-0" alt="Social Media Icon" />
          </div>
        </footer>
      </section>
    </main>
  );
}