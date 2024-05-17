export default async function Error() {
    return (
      <>
      <h1>
        Error appear... Please Register or make sure the data you input is correct.
      </h1>
      <h1>
        Press button below to back to login page.
      </h1>
      <a href="/">
      <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-10">
        Back
      </button>
      </a>
      </>
    )
  }