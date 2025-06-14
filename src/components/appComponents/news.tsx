export const News = ({data}:any) => {
    console.log('data', data)
    return (
        <div className="w-full h-full px-6 pt-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {/* {data.map((item:any,index:number)=>{
                <div key={index}  className="w-full h-fil px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                    <img src={item.thumbnail.resolution[0].url} alt="thumbnail"/>
                    <div>
                    <h2>{item.title}</h2>
                    </div>
                </div>
            })} */}
            <h1>anil</h1>
        </div>
    )
}