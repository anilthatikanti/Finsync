import { useEffect, useState } from "react";
import { News } from "./news";
import axiosInstance from "../../services/axiosInstance";
import type { IStockData, IWatchList } from "../../shared/stock.interface";
import { useLiveData } from "../../hooks/useLiveDataStore";
import { tickerStore } from "../../store/tickerStore";

const WatchList: React.FC = () => {
  const WATCHLIST: IWatchList[] = [
    {
      _id: 1, watchListName: 'WatchList_1', stocks: [
      ]
    },
    { _id: 2, watchListName: 'WatchList_2', stocks: [] },
    { _id: 3, watchListName: 'WatchList_3', stocks: [] },
    { 
      _id: 4, watchListName: 'WatchList_4', stocks: [] },
    { _id: 5, watchListName: 'WatchList_5', stocks: [] }
  ]
  const [watchlist,setWatchList] = useState<IWatchList[]>(WATCHLIST)
  const liveData = useLiveData()
  const [activeTab, setActiveTab] = useState(watchlist[0]._id);
  const [news,setNews] = useState()
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === '') return;
      try {
        const response: any = await axiosInstance.get(`/stocks/search?q=${query}`)
        const data = response.data['payload']['quotes'];
        setNews(response.data['payload']['news'])
        setSearchResults(data.filter((stock: any) => stock.isYahooFinance)) // Adjust based on your API structure
      } catch (e) {
        console.log('Search ERR: ', e)
      } finally {

      }
    }

    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 400); // debounce delay

    return () => clearTimeout(delayDebounce)
  }, [query])



  function getWatchListRows() {
    const selectedWatchList: IWatchList | undefined = watchlist.find(wl => wl._id === activeTab);
    return (
      <div className="h-full w-full">
        {/* Header table */}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-auto">
          <thead className="text-xs uppercase">
            <tr>
              <th className="py-3 text-gray-400">Name</th>
              <th className="text-right pr-6 py-3 text-gray-400">Price</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable content */}
        <div className="overflow-y-auto no-scrollbar h-[70%] md:h-[85%]">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {selectedWatchList?.stocks.map((stock:IStockData,index:number) => (
                <tr key={stock.symbol} className={`bg-white ${index !== selectedWatchList.stocks.length - 1 ? 'border-b border-gray-200' : ''} dark:bg-gray-800 dark:border-gray-700`}>
                  <th className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {stock.name}
                  </th>
                  <td className="text-right pr-6 py-4">{liveData.get(stock.symbol)?.price||stock.current_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function getSearchStocks() {
    function updateWatchlistStock(stockItem:IStockData){
      watchlist.map((stock:IWatchList) => {
        if(stock._id === activeTab){
          stock.stocks.push(stockItem)
        }
        tickerStore.subscribeToSymbol(stockItem.symbol)
      })
      console.log('watchlist',watchlist)
      setWatchList([...watchlist])
    }

    return (
      <div className="h-full w-full">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-auto">
          <thead className="text-xs uppercase">
            <tr>
              <th className="py-3 text-gray-400">Name</th>
              <th className="text-right pr-6 py-3 text-gray-400">Exchange</th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto no-scrollbar h-[70%] md:h-[85%]">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {searchResults.map((stock: any, index: number) => (
                <tr key={index} className={`bg-white ${index !== searchResults.length - 1 ? 'border-b border-gray-200' : ''} dark:bg-gray-800 dark:border-gray-700`}>
                  <th className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex justify-between items-center">
                    {stock.longname}
                    <button className="border-1 border-solid border-indigo-500 px-1.5 pb-[2px] mr-3 text-indigo-500 hover:bg-indigo-500 hover:text-white" onClick={()=>updateWatchlistStock(stock)}>
                      +
                    </button>
                  </th>
                  <td className="text-right pr-6 py-4">
                    {stock.exchange || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full md:flex gap-2">
      <div className="w-full h-full lg:w-[65%] px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="w-full h-[calc(100vh-135px)]">
          {/* Tabs + Search */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center mb-3">
            <ul className="w-full md:w-[55%] flex overflow-x-auto no-scrollbar whitespace-nowrap text-sm font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
              {watchlist.map((w:IWatchList,index:number) => (
                <li className="me-2" key={index}>
                  <a
                    onClick={() => setActiveTab(w._id)}
                    href="#"
                    className={`inline-block p-4 rounded-t-lg ${activeTab === w._id ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'}`}>
                    {w.watchListName}
                  </a>
                </li>
              ))}
            </ul>

            {/* Search input */}
            <form className="w-full md:w-[40%] mt-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="default-search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search stock..."
                />
              </div>
            </form>
          </div>

          {/* Table */}
          {query ? getSearchStocks() : getWatchListRows()}
        </div>
      </div>

      <div className="w-[35%] hidden lg:block">
        <News data={news||[]}/>
      </div>
    </div>
  );
};

export default WatchList;
