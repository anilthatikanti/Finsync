import { useEffect, useMemo, useState, useCallback } from "react";
import { News } from "./news";
import axiosInstance from "../../services/axiosInstance";
import type { IWatchList, searchStock } from "../../shared/stock.interface";
import { useLiveData } from "../../hooks/useLiveDataStore";
import { tickerStore } from "../../store/tickerStore";

const WatchList: React.FC = () => {
  const [watchList, setWatchList] = useState<IWatchList[]>([]);
  const [activeTab, setActiveTab] = useState<IWatchList>({} as IWatchList);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<searchStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState<string>("");
  const [updatedBtnLoading, setUpdatedBtnLoading] = useState<string>("");

  const activeWatchList = useMemo(
    () => watchList.find((wl) => wl._id === activeTab?._id),
    [watchList, activeTab]
  );

  const symbols = useMemo(() => {
    return (
      activeWatchList?.stocks
        ?.map((s) => s?.symbol)
        .filter((s): s is string => typeof s === "string") || []
    );
  }, [activeWatchList]);

  const liveData = useLiveData(symbols);

  useEffect(() => {
    const fetchWatchList = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/stocks/get-watchlist");
        if (res.status && res.data.payload?.length > 0) {
          setWatchList(res.data.payload);
          setActiveTab(res.data.payload[0]);
        }
      } catch (err) {
        console.error("Failed to fetch watchList", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchList();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/stocks/search?q=${query}`);
        const quotes = res.data.payload?.quotes || [];
        setSearchResults(
          quotes.filter((stock: searchStock) => !!stock.longname)
        );
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSearchResults, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const updateWatchListStock = useCallback(
    async (stockItem: searchStock) => {
      setUpdatedBtnLoading(stockItem.symbol);
      try {
        const res = await axiosInstance.patch("/stocks/add-watchlist", {
          watchListId: activeTab?._id,
          stockSymbol: stockItem.symbol,
          longName: stockItem.longname,
        });

        if (res.status) {
          setWatchList((prev) =>
            prev.map((w) =>
              w._id === activeTab?._id
                ? {
                    ...w,
                    stocks: [
                      ...w.stocks,
                      {
                        symbol: stockItem.symbol,
                        longName: stockItem.longname,
                      },
                    ],
                  }
                : w
            )
          );
          setActiveTab((prev: IWatchList) => {
            if (prev?._id === activeTab?._id) {
              return {
                ...prev,
                stocks: [
                  ...prev.stocks,
                  {
                    symbol: stockItem.symbol,
                    longName: stockItem.longname,
                  },
                ],
              };
            }
            return prev;
          });

          if (stockItem.symbol) {
            tickerStore.subscribeToSymbol(stockItem.symbol);
          }
          setQuery(""); // Clear search query after adding stock
        }
      } catch (err) {
        console.error("Update WatchList Error:", err);
      } finally {
        setUpdatedBtnLoading("");
      }
    },
    [activeTab, setQuery]
  );

  const deleteStockFromWatchList = useCallback(
    async (stockItem: searchStock) => {
      setDeleteBtnLoading(stockItem.symbol);
      try {
        const response = await axiosInstance.patch("/stocks/del-watchlist", {
          watchListId: activeTab?._id,
          stockSymbol: stockItem.symbol,
        });
        if (response.status) {
          setWatchList((prev) =>
            prev.map((w) =>
              w._id === activeTab?._id
                ? {
                    ...w,
                    stocks: w.stocks.filter(
                      (s) => s.symbol !== stockItem.symbol
                    ),
                  }
                : w
            )
          );
          setActiveTab((prev: IWatchList) => {
            if (prev?._id === activeTab?._id) {
              return {
                ...prev,
                stocks: prev?.stocks.filter(
                  (s) => s.symbol !== stockItem.symbol
                ),
              };
            }
            return prev;
          });
          tickerStore.unsubscribeFromSymbol(stockItem.symbol);
          setQuery(""); // Clear search query after deleting stock
        }
      } catch (err) {
        console.error("Delete Stock from WatchList Error:", err);
      } finally {
        setDeleteBtnLoading("");
      }
    },
    [activeTab, setQuery]
  );

  const renderWatchListRows = () => (
    <div className="h-full w-full">
      {!activeWatchList?.stocks?.length ? (
        <div className="h-full w-full flex justify-center items-center">
          <img
            src="/logos/watchlist_empty_page.svg"
            className="h-[40%] "
            alt="Finsync Logo"
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center w-full text-xs uppercase text-gray-400 py-3 border-b border-gray-200 dark:border-gray-700">
            <div>Name</div>
            <div>Price</div>
          </div>
          {/* Rows */}
          <div className="overflow-y-auto no-scrollbar h-[70%] md:h-[85%]">
            {activeWatchList?.stocks.map((stock, index) => {
              const live = liveData.get(stock.symbol);
              const price = live?.price ?? 0;
              const change = live?.changePercent ?? 0;
              const priceColor =
                change > 0
                  ? "text-green-500"
                  : change < 0
                  ? "text-red-500"
                  : "text-gray-500";
              return (
                <div
                  key={stock.symbol}
                  className={`flex justify-between items-center gap-2 bg-white dark:bg-gray-800 ${
                    index !== activeWatchList.stocks.length - 1
                      ? "border-b border-gray-200 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <div className="w-fit py-2 font-medium text-[12px] md:text-base text-gray-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap ">
                    {stock.longName}
                  </div>
                  <div
                    className={`w-fit flex flex-col text-right  py-2 text-[10px] md:text-[14px] ${priceColor}`}
                  >
                    {price.toFixed(2)}
                    {change !== 0 && (
                      <span
                        className={`text-[8px] md:text-[12px]  ${priceColor}`}
                      >
                        ({change > 0 ? "+" : ""}
                        {change.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  const renderSearchResults = () => (
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
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {searchResults.map((stock, index) => (
                <tr
                  key={index}
                  className={`bg-white ${
                    index !== searchResults.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  } dark:bg-gray-800 dark:border-gray-700`}
                >
                  <th className="py-4 font-medium text-gray-900  dark:text-white flex justify-between items-center">
                    {stock.longname}
                    {activeTab?.stocks
                      .map((s) => s.symbol)
                      .includes(stock.symbol) ? (
                      <button
                        disabled={deleteBtnLoading === stock.symbol}
                        className="border-1 border-solid  border-red-500 h-[20px] w-[20px] text-red-500 hover:bg-red-500  hover:text-white flex justify-center items-center"
                        onClick={() => deleteStockFromWatchList(stock)}
                      >
                        {deleteBtnLoading === stock.symbol ? (
                          <svg
                            aria-hidden="true"
                            className="w-3 h-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          "-"
                        )}
                      </button>
                    ) : (
                      <button
                        disabled={updatedBtnLoading === stock.symbol}
                        style={{ font: "status-bar" }}
                        className=" border-1 border-solid border-indigo-500 h-[20px] w-[20px] text-indigo-500 hover:bg-indigo-500 hover:text-white flex justify-center items-center"
                        onClick={() => updateWatchListStock(stock)}
                      >
                        {updatedBtnLoading === stock.symbol ? (
                          <svg
                            aria-hidden="true"
                            className="w-3 h-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          "+"
                        )}
                      </button>
                    )}
                  </th>
                  <td className="text-right pr-6 py-4">
                    {stock.exchange || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return loading && query.length === 0 ? (
    <div className="flex justify-center items-center h-full w-full">
      <svg
        aria-hidden="true"
        className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <div className="h-full w-full md:flex gap-2">
      <div className="w-full h-full lg:w-[65%] px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <div className="w-full h-[calc(100vh-135px)]">
          <div className="w-full flex flex-col md:flex-row justify-between items-center mb-3">
            <ul className="w-full md:w-[55%] flex overflow-x-auto no-scrollbar whitespace-nowrap text-sm font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
              {watchList.map((w) => (
                <li key={w._id} className="me-2">
                  <a
                    href="#"
                    onClick={() => setActiveTab(w)}
                    className={`inline-block p-4 rounded-t-lg ${
                      activeTab?._id === w._id
                        ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {w.watchListName}
                  </a>
                </li>
              ))}
            </ul>

            <form
              className="w-full md:w-[40%] mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stock..."
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
            </form>
          </div>

          {query ? renderSearchResults() : renderWatchListRows()}
        </div>
      </div>

      <div className="w-[35%] hidden lg:block">
        <News />
      </div>
    </div>
  );
};

export default WatchList;
