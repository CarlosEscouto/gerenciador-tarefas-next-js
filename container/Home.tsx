import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { List } from "../components/List";
import { executeRequest } from "../services/Api";
import { AccessTokenProps } from "../types/AccessTokenProps";
import { TaskRequest } from "../types/TaskRequest";
import moment from "moment";

const Home: NextPage<AccessTokenProps> = ({ setAccessToken }) => {
  const [tasks, setTasks] = useState<TaskRequest[]>([]);
  const [expectedfinishAtStarts, setPeriodoDe] = useState("");
  const [expectedfinishAtEnds, setPeriodoAte] = useState("");
  const [status, setStatus] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [name, setName] = useState("");
  const [expectedfinishAt, setExpectedfinishAt] = useState("");

  const getFilteredList = async () => {
    try {
      let filtros = "?status=" + status;

      if (expectedfinishAtStarts) {
        filtros += "&expectedfinishAtStarts=" + expectedfinishAtStarts;
      }

      if (expectedfinishAtEnds) {
        filtros += "&expectedfinishAtEnds=" + expectedfinishAtEnds;
      }

      const result = await executeRequest("task" + filtros, "GET");
      if (result && result.data) {
        setTasks(result.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const doSave = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!name || !expectedfinishAt) {
        setMsgErro("Favor preencher o nome e data de previsão");
        setLoading(false);
        return;
      }

      const formatData = moment(expectedfinishAt).format(
        "YYYY-MM-DD hh:mm:ss Z"
      );

      const body = {
        name,
        expectedfinishAt: formatData,
      };

      await executeRequest("task", "POST", body);
      await getFilteredList();
      closeModal();
    } catch (e: any) {
      console.error(e);
      if (e?.response?.data?.error) {
        setMsgErro(e?.response?.data?.error);
      } else {
        setMsgErro("Ocorreu erro ao adicionar tarefa tente novamente!");
      }
    }

    setLoading(false);
  };

  const closeModal = () => {
    setName("");
    setExpectedfinishAt("");
    setLoading(false);
    setMsgErro("");
    setShowModal(false);
  };

  useEffect(() => {
    getFilteredList();
  }, [expectedfinishAtStarts, expectedfinishAtEnds, status]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setAccessToken("");
  };

  return (
    <>
      <Header logout={logout} setShowModal={setShowModal} />
      <Filter
        expectedfinishAtStarts={expectedfinishAtStarts}
        expectedfinishAtEnds={expectedfinishAtEnds}
        status={status}
        setExpectedfinishAtStarts={setPeriodoDe}
        setExpectedfinishAtEnds={setPeriodoAte}
        setStatus={setStatus}
      />
      <List tasks={tasks} getFilteredList={getFilteredList} />
      <Footer setShowModal={setShowModal} />
      <Modal
        show={showModal}
        onHide={() => closeModal()}
        className="container-modal"
      >
        <Modal.Body>
          <p>Adicionar uma tarefa</p>
          {msgErro && <p className="error">{msgErro}</p>}
          <input
            type="text"
            placeholder="Nome da tarefa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Data de previsão de conclusão"
            value={expectedfinishAt}
            onChange={(e) => setExpectedfinishAt(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) =>
              expectedfinishAt
                ? (e.target.type = "date")
                : (e.target.type = "text")
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="button col-12">
            <button onClick={doSave} disabled={isLoading}>
              {isLoading ? "...Enviando dados" : "Salvar"}
            </button>
            <span onClick={closeModal}>Cancelar</span>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { Home };
