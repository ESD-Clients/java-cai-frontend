import { useEffect } from "react";
import { useState } from "react";
import { MessageController } from "../../controllers/_Controllers";
import Loading from "../../modals/Loading";

export default function Messages({ user }) {

  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    async function fetchData() {
      let messages = await MessageController.getList();
      setMessages(messages);

      setLoaded(true);
    }

    if (!loaded) fetchData();
  }, [loaded])

  if (!loaded) return <Loading />

  return (
    <>
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="w-full lg:pr-8 p-0">
          <div className="mb-4">
            Total Number of Messages:
          </div>

          <table className="table w-full">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {
                messages.map((item, i) => (
                  <tr key={i.toString()}>
                    <td className="font-bold">{item.subject}</td>
                    <td>{item.content}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
            messages.length === 0 && (
              <div className="flex justify-center items-center text-gray-500 mt-4 text-sm">(No Data Available)</div>
            )
          }

        </div>
      </div>
    </>
  )
}