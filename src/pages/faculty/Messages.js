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
      <div className="drawer drawer-mobile">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">

          {/* <!-- Page content here --> */}
          <div>
            <div className="p-6">
              <div className="flex xl:flex-row flex-col justify-between">
                <div className="w-full lg:pr-8 p-0">
                  <div className="mb-4">
                    Total Number of Messages:
                    {/* <?php echo mysqli_num_rows(mysqli_query($conn, 'SELECT * from tb_messages')) ?> */}
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
                  {/* <?php
                  $messages = mysqli_query($conn, 'SELECT * from tb_messages');

                            if (mysqli_num_rows($messages) > 0) {
                    $index = 1;
                  echo '<table className="table w-full">
                    <thead>
                      <th>Subject</th>
                      <th>Content</th>
                    </thead>
                    <tbody>';
                      while ($row = mysqli_fetch_assoc($messages)) {
                        echo '<tr><td className="font-bold">' . $row['subject'] . '</td><td>' . $row['content'] . '</td></tr>';

                      $index++;
                                }
                      echo '</tbody></table>';
                            } else {
                    echo '<div className="flex justify-center items-center">No Data Available</div>';
                            }
                            ?> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}