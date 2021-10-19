import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import task from "../pages/api/task";
import { executeRequest } from "../services/Api";
import { TaskRequest } from "../types/TaskRequest";
import { Item } from "./Item";

type ListProps = {
  tasks: TaskRequest[];
  getFilteredList(): void;
};

const List: NextPage<ListProps> = ({ tasks, getFilteredList }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [id, setId] = useState<string | undefined>("");
  const [name, setName] = useState("");
  const [expectedfinishAt, setExpectedfinishAt] = useState("");
  const [finishDate, setFinishDate] = useState("");

  const doUpdate = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!id || !name || !expectedfinishAt) {
        setMsgErro("Favor preencher id, nome e data de previsão");
        setLoading(false);
        return;
      }

      const body = {
        name,
        expectedfinishAt: expectedfinishAt
          ? moment(expectedfinishAt).format("YYYY-MM-DD 23:59:59 Z")
          : null,
        finishAt: finishDate
          ? moment(finishDate).format("YYYY-MM-DD 23:59:59 Z")
          : null,
      };

      await executeRequest(`task/${id}`, "PUT", body);
      await getFilteredList();
      closeModal();
    } catch (e: any) {
      if (e?.response?.data?.error) {
        setMsgErro(e?.response?.data?.error);
      } else {
        setMsgErro("Ocorreu erro ao alterar tarefa tente novamente!");
      }
    }

    setLoading(false);
  };

  const doDelete = async (e: any) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!id) {
        setMsgErro("Favor preencher id para deletar");
        setLoading(false);
        return;
      }

      await executeRequest(`task/${id}`, "DELETE");
      await getFilteredList();
      closeModal();
    } catch (e: any) {
      if (e?.response?.data?.error) {
        setMsgErro(e?.response?.data?.error);
      } else {
        setMsgErro("Ocorreu erro ao deletar tarefa tente novamente!");
      }
    }

    setLoading(false);
  };

  const closeModal = () => {
    setName("");
    setExpectedfinishAt("");
    setFinishDate("");
    setId("");
    setLoading(false);
    setMsgErro("");
    setShowModal(false);
  };

  const selectTaskToEdit = (task: TaskRequest) => {
    setId(task._id);
    setName(task.name);
    setExpectedfinishAt(
      moment(task.expectedfinishAt).format("yyyy-MM-DD hh:mm:ss Z")
    );
    setFinishDate(
      task.finishAt ? moment(task.finishAt).format("yyyy-MM-DD hh:mm:ss Z") : ""
    );
    setShowModal(true);
    setMsgErro("");
  };

  return (
    <>
      <div
        className={
          "container-list" + (tasks && tasks.length === 0 ? " vazia" : "")
        }
      >
        {tasks && tasks.length > 0 ? (
          tasks.map((t, index) => (
            <Item task={t} key={index} selectTaskToEdit={selectTaskToEdit} />
          ))
        ) : (
          <>
            <img src="/empty-list.svg" alt="Nenhuma tarefa encontrada" />
            <p>Você ainda não possui tarefas cadastradas!</p>
          </>
        )}
      </div>
      <Modal
        show={showModal}
        onHide={() => closeModal()}
        className="container-modal"
      >
        <Modal.Body>
          <p>Alterar uma tarefa</p>
          {msgErro && <p className="error">{msgErro}</p>}
          <input
            type="text"
            placeholder="Nome da tarefa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type={expectedfinishAt ? "date" : "text"}
            placeholder="Data de previsão de conclusão"
            value={
              expectedfinishAt
                ? moment(expectedfinishAt).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) => setExpectedfinishAt(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) =>
              expectedfinishAt
                ? (e.target.type = "date")
                : (e.target.type = "text")
            }
          />
          <input
            type={finishDate ? "date" : "text"}
            placeholder="Data de conclusão"
            value={finishDate ? moment(finishDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setFinishDate(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) =>
              finishDate ? (e.target.type = "date") : (e.target.type = "text")
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="button col-12">
            <button onClick={doUpdate} disabled={isLoading}>
              {isLoading ? "...Enviando dados" : "Salvar alterações"}
            </button>
            <span onClick={doDelete}>Excluir Tarefa</span>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { List };
