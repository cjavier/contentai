import React, { useState } from "react";

export default function Landing() {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);

  return (
    <header className="items-center bg-slate-900 flex flex-col">
      <nav className="self-center flex w-full max-w-screen-xl flex-col mt-6 max-md:max-w-full">
        <div className="justify-between items-start shadow-lg bg-white bg-opacity-10 self-center flex w-full max-w-[1000px] gap-5 p-6 rounded-3xl max-md:max-w-full max-md:flex-wrap">
          <div className="items-center self-stretch flex flex-col pr-5 py-2 max-md:max-w-full">
            <div className="flex w-[310px] max-w-full items-start justify-between gap-5 self-start">
              <h1 className="text-white text-3xl font-bold leading-9">AIContent</h1>
              <div className="items-start self-center flex w-[119px] max-w-full justify-between gap-5 my-auto">
                <a href="#" className="text-white text-base font-medium leading-6 tracking-wide self-stretch">Costos</a>
                <a href="#" className="text-white text-base font-medium leading-6 tracking-wide self-stretch whitespace-nowrap">Blog</a>
              </div>
            </div>
          </div>
          <div className="items-start self-stretch flex w-[300px] max-w-full justify-between gap-5">
            <a href="#" className="text-white text-base font-medium leading-6 tracking-wide my-auto">Iniciar Sesión</a>
            <button className="justify-center items-center border-[color:var(--purple-600,#9333EA)] bg-purple-600 self-stretch flex w-[156px] max-w-full flex-col px-5 py-3 rounded-lg border-2 border-solid">
              <span className="text-white text-base font-medium leading-6 tracking-wide self-center whitespace-nowrap">Crear Cuenta</span>
            </button>
          </div>
        </div>
      </nav>
      <section className="items-center self-stretch flex grow flex-col mt-28 max-md:max-w-full max-md:mt-10">
        <div className="items-center self-stretch flex flex-col px-5 max-md:max-w-full">
          <h2 className="self-center text-white text-center text-7xl font-extrabold leading-[79.2px] w-full -ml-5 max-md:max-w-full max-md:text-4xl">Crea contenido optimizado para SEO rápido y barato</h2>
          <p className="self-center text-white text-center text-lg leading-7 w-full -ml-5 mt-8 max-md:max-w-full">Usa la inteligencia artificial para crear contenido único y optimizado para SEO</p>
          <div className="justify-center items-start self-center flex w-[352px] max-w-full gap-4 mt-8">
            <button className="text-white text-xl font-medium leading-6 tracking-wide self-stretch whitespace-nowrap justify-center items-center border-[color:var(--purple-600,#9333EA)] bg-purple-600 flex-1 px-5 py-4 rounded-lg border-2 border-solid max-md:pl-0.5 max-md:pr-px">Probar Grátis</button>
            <button className="justify-center items-center border-[color:var(--White,#FFF)] flex flex-col flex-1 px-5 py-4 rounded-lg border-2 border-solid">
              <span className="text-white text-xl font-medium leading-6 tracking-wide self-center whitespace-nowrap">Conoce Más</span>
            </button>
          </div>
        </div>
      </section>
      <section className="items-center shadow-lg bg-white self-center flex w-full max-w-[1100px] grow flex-col mt-20 pt-2 rounded-3xl max-md:max-w-full max-md:mt-10">
        <div className="items-start self-center flex w-full max-w-[1068px] justify-between gap-5 px-5 max-md:max-w-full max-md:flex-wrap max-md:justify-center">
          <div className="items-start self-center flex gap-1.5 my-auto max-md:justify-center">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f82929c-c9b9-4ec8-b2bb-e1801ec4ce07?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a99f00f-b585-4130-a5e1-f514cc8c785b?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/018692a2-84ef-4876-91bb-928cac14f077?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
          </div>
          <div className="justify-center items-center bg-slate-100 self-stretch flex flex-col px-5 py-1 rounded-md max-md:max-w-full">
            <span className="text-slate-400 text-xs leading-4 self-center whitespace-nowrap">app.weeb.ai</span>
          </div>
          <div className="justify-between items-start self-stretch flex gap-1.5">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8485e013-fbe2-4934-9803-12d4e738c23b?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/97954d65-4def-4b52-948f-148f85f578f8?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
          </div>
        </div>
        <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fadd410b-3963-472a-86c1-b172322b3943?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.66] object-contain object-center w-full self-stretch overflow-hidden grow mt-2 max-md:max-w-full" />
      </section>
      <section className="self-center w-full max-w-[1255px] mt-40 px-5 max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[68%] max-md:w-full max-md:ml-0">
            <div className="justify-center items-start flex grow flex-col max-md:max-w-full max-md:mt-10">
              <div className="items-start self-stretch flex grow flex-col pb-4 max-md:max-w-full">
                <div className="items-start flex w-[800px] max-w-full flex-col self-start">
                  <h3 className="text-white text-xl font-bold leading-5 tracking-[3px] uppercase max-md:max-w-full">Buyer persona</h3>
                  <h2 className="text-purple-50 text-7xl font-extrabold leading-[79.2px] mt-4 max-md:max-w-full max-md:text-4xl">
                    <span className="text-purple-400">Contenido </span>
                    <span className="text-purple-50"> hecho a la medida para tu audiencia </span>
                  </h2>
                </div>
                <p className="text-white text-lg leading-7 mt-8 max-md:max-w-full">Personaliza tu contenido a tu audiencia objetivo mediante la definición de Buyer personas. Todo el contenido será escrito con tu buyer persona al frente logrando contenidos más enganchantes.</p>
                <div className="justify-center items-start self-center flex w-[323px] max-w-full gap-4 mt-12 rounded-lg self-start max-md:mt-10">
                  <button className="text-white text-xl font-medium leading-6 tracking-wide max-w-[304px] self-stretch grow shrink-0 basis-auto">¿Qué es Prompt Engeneering?</button>
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/70cd0250-0e27-4ca7-be21-b93912e35873?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-6 overflow-hidden self-stretch max-w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[32%] ml-5 max-md:w-full max-md:ml-0">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a5c68dd9-4c76-48b5-b466-19bf0b588aa7?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-[0.99] object-contain object-center w-[375px] overflow-hidden max-w-full my-auto max-md:mt-10" />
          </div>
        </div>
      </section>
      <section className="self-center w-full max-w-[1276px] mt-40 px-5 max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[38%] max-md:w-full max-md:ml-0">
            <div className="items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
              <div className="items-start self-stretch flex flex-col max-md:max-w-full">
                <div className="text-white text-xl font-bold leading-5 tracking-[3px] uppercase max-md:max-w-full">AUTOMATICO</div>
                <div className="text-white text-6xl font-extrabold leading-[61.6px] mt-4 max-md:max-w-full max-md:text-4xl">Contenido Automatizado</div>
              </div>
              <p className="text-white text-lg leading-7 mt-8 max-md:max-w-full">Ahorra tiempo y recursos generando contenido relevante y de alta calidad automáticamente con IA.</p>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[62%] ml-5 max-md:w-full max-md:ml-0">
            <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/a6b74283-336f-4c01-a5c7-6e438ab0143a?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.18] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-10" />
          </div>
        </div>
      </section>
      <section className="self-center w-full max-w-[1164px] mt-40 pr-3.5 py-3.5 max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
          <div className="flex flex-col items-stretch w-[76%] max-md:w-full max-md:ml-0">
            <div className="justify-center items-start flex flex-col my-auto max-md:max-w-full max-md:mt-10">
              <div className="items-start self-stretch flex flex-col max-md:max-w-full">
                <div className="items-start self-stretch flex flex-col max-md:max-w-full">
                  <div className="text-white text-xl font-bold leading-5 tracking-[3px] uppercase max-md:max-w-full">ESPECIALIZADO</div>
                  <div className="text-purple-50 text-7xl font-extrabold leading-[79.2px] mt-4 max-md:max-w-full max-md:text-4xl">Nichos Específicos</div>
                </div>
                <p className="text-white text-lg leading-7 mt-8 max-md:max-w-full">Escribe contenido técnico y especializado como si fueras un experto con la ayuda de la Inteligencia artificial.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-[24%] ml-5 max-md:w-full max-md:ml-0">
            <div className="border-[color:var(--purple-900,#581C87)] flex w-64 h-64 flex-col mx-auto border-[5px] border-solid max-md:mt-10" />
          </div>
        </div>
      </section>
      <section className="self-stretch flex w-full flex-col mt-40 max-md:max-w-full max-md:mt-10">
        <div className="self-center w-full max-w-[1239px] px-5 max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[46%] max-md:w-full max-md:ml-0">
              <div className="items-start self-stretch flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                <div className="items-start self-stretch flex flex-col max-md:max-w-full">
                  <div className="text-white text-xl font-bold leading-5 tracking-[3px] uppercase max-md:max-w-full">PERSONALIZACIÓN</div>
                  <div className="text-white text-6xl font-extrabold leading-[61.6px] mt-4 max-md:max-w-full max-md:text-4xl">Adaptabilidad</div>
                </div>
                <p className="text-white text-lg leading-7 mt-8 max-md:max-w-full">Personaliza el tono, estilo y formato del contenido según las necesidades de tu marca.</p>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[54%] ml-5 max-md:w-full max-md:ml-0">
              <img loading="lazy" srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/cd3b91c3-623e-4504-ab6b-6413e298396d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"className="aspect-[1.1] object-contain object-center w-full overflow-hidden grow max-md:max-w-full max-md:mt-10" />
            </div>
          </div>
        </div>
      </section>
      <section className="justify-center items-center self-stretch bg-purple-900 flex w-full flex-col mt-20 px-5 py-20 max-md:max-w-full max-md:mt-10">
        <h2 className="self-center text-white text-center text-6xl font-extrabold leading-[61.6px] w-[1280px] max-w-screen-xl -ml-5 max-md:max-w-full max-md:text-4xl">Preguntas Frecuentes</h2>
        <div className="items-start self-center flex w-full max-w-screen-xl flex-col mt-20 max-md:max-w-full max-md:mt-10">
        <section
  className="justify-center items-start border-t-[color:var(--blue-gray-200,#E2E8F0)] self-stretch flex flex-col py-8 border-t border-solid max-md:max-w-full"
  onClick={() => setToggle1(!toggle1)}
>
  <div className="flex items-center">
    <h2 className="text-white text-2xl leading-10 self-stretch max-w-[1342px] grow shrink-0 basis-auto max-md:max-w-full">
      ¿Cómo la IA mejora la calidad del contenido?
    </h2>
  </div>
  {toggle1 && (
    <p className="text-white text-lg text-center mx-8">
       La IA analiza datos y tendencias para ayudar a crear entradas de blog relevantes y atractivas.
    </p>
  )}
  <img
    loading="lazy"
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a9b1422-6061-4a4b-85fc-8fdab0630162?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"
    className="aspect-square object-contain object-center w-6 overflow-hidden self-center max-w-full my-auto"
    alt="Content Image"
  />
</section>

<section
  className="justify-center items-start border-t-[color:var(--blue-gray-200,#E2E8F0)] self-stretch flex flex-col py-8 border-t border-solid max-md:max-w-full"
  onClick={() => setToggle2(!toggle2)}
>
  <div className="flex items-center">
    <h2 className="text-white text-2xl leading-10 self-stretch max-w-[1342px] grow shrink-0 basis-auto max-md:max-w-full">
      ¿En qué nichos es más efectiva esta herramienta?
    </h2>
  </div>
  {toggle2 && (
    <p className="text-white text-lg text-center mx-8">
      Es especialmente útil en sectores como salud, tecnología y finanzas donde el contenido especializado de blog es crucial.
    </p>
  )}
  <img
    loading="lazy"
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/9eb18439-1231-436e-8570-11761900b7b6?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"
    className="aspect-square object-contain object-center w-6 overflow-hidden self-center max-w-full my-auto"
    alt="Content Image"
  />
</section>

<section
  className="justify-center items-start border-t-[color:var(--blue-gray-200,#E2E8F0)] self-stretch flex grow flex-col py-8 border-t border-solid max-md:max-w-full"
  onClick={() => setToggle3(!toggle3)}
>
  <div className="flex items-center">
    <h2 className="text-white text-2xl leading-10 self-stretch max-w-[1342px] grow shrink-0 basis-auto max-md:max-w-full">
      ¿Qué nivel de personalización ofrece la herramienta para las entradas de blog?
    </h2>
  </div>
  {toggle3 && (
    <p className="text-white text-lg text-center mx-8">
      Puedes ajustar el tono, estilo y formato según las necesidades y la identidad de tu marca.
    </p>
  )}
  <img
    loading="lazy"
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ad1c0a2-de8d-4d7f-b8af-bdf3386f0fef?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&"
    className="aspect-square object-contain object-center w-6 overflow-hidden self-center max-w-full my-auto"
    alt="Content Image"
  />
</section>

    </div>
      </section>
      <footer className="justify-center items-start border-t-[color:var(--blue-gray-300,#CBD5E1)] bg-white self-stretch flex w-full flex-col pb-12 px-5 border-t border-solid max-md:max-w-full">
        <div className="items-start self-center border-b-[color:var(--blue-gray-200,#E2E8F0)] flex w-full max-w-screen-xl flex-col py-12 border-b border-solid max-md:max-w-full">
          <div className="self-stretch max-md:max-w-full">
            <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-1/5 max-md:w-full max-md:ml-0">
                <h2 className="text-slate-900 text-3xl font-bold leading-9 max-md:mt-10">ContentAI</h2>
              </div>
              <div className="flex flex-col items-stretch w-4/5 ml-5 max-md:w-full max-md:ml-0">
                <div className="grow mt-3 max-md:max-w-full max-md:mt-10">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                      <div className="items-start flex flex-col pr-5 pb-3 max-md:mt-10">
                        <h3 className="text-slate-400 text-base font-medium leading-4 whitespace-nowrap self-start">PRODUCTO</h3>
                        <div className="items-start flex w-28 max-w-full flex-col mt-6 self-start">
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap self-start">Precio</h4>
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap mt-6 self-start">Sobre Nosotros</h4>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
                      <div className="items-start flex grow flex-col pr-5 pb-3 max-md:mt-10">
                        <h3 className="text-slate-400 text-base font-medium leading-4 uppercase whitespace-nowrap self-start">SOLUCIONES</h3>
                        <div className="items-start flex w-[162px] max-w-full flex-col mt-6 self-start">
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap self-start">Planes de Keywords</h4>
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap mt-6 self-start">Ideas de Contenidos</h4>
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap mt-6 self-start">Outlines</h4>
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap mt-6 self-start">
                            <ul>
                              <li>Creación de Contenido</li>
                            </ul>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
                      <div className="items-start flex flex-col pr-5 pb-14 max-md:mt-10">
                        <h3 className="text-slate-400 text-base font-medium leading-4 uppercase whitespace-nowrap self-start">Resources</h3>
                        <div className="items-start flex w-[45px] max-w-full flex-col mt-6 self-start">
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap self-start">Ayuda</h4>
                          <h4 className="text-slate-900 text-base leading-6 whitespace-nowrap mt-6 self-start">Blog</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="items-start self-center flex w-full max-w-screen-xl justify-between gap-5 mt-12 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
          <h4 className="text-slate-900 text-base leading-6 self-stretch max-w-[1127px] grow shrink-0 basis-auto max-md:max-w-full">@ 2023 Weeb, Inc. All rights reserved.</h4>
          <div className="items-start self-stretch flex gap-4 max-md:justify-center">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7698b6de-97f7-4411-9030-78a7824e835d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/4963fd33-7d1b-4a88-9fa4-0737c5bb2e8d?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/14556fcd-fbd3-4c81-9d60-3320a3de4e10?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/fbc0117f-7212-4b0a-86f8-b51118558cce?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/510ca13c-ce34-4149-b2eb-ec3b7f449a34?apiKey=bb1428aa2e884cdca53d77fd4f1afaa9&" className="aspect-square object-contain object-center w-full overflow-hidden flex-1" />
          </div>
        </div>
      </footer>
    </header>
  );
}