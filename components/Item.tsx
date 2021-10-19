import type { NextPage } from "next";
import moment from "moment";
import { TaskRequest } from "../types/TaskRequest";

type ItemProps = {
  task: TaskRequest;
  selectTaskToEdit(task: TaskRequest): void;
};

const Item: NextPage<ItemProps> = ({ task, selectTaskToEdit }) => {
  const getDateText = (
    finishDate: Date | undefined,
    expectedfinishAt: Date
  ) => {
    if (finishDate) {
      return `Concluído em: ${moment(finishDate).format("DD/MM/yyyy")}`;
    }
    return `Previsão de conclusão em: ${moment(expectedfinishAt).format(
      "DD/MM/yyyy"
    )}`;
  };

  return (
    <div
      className={"container-item" + (task.finishAt ? "" : " ativo")}
      onClick={() => (task.finishAt ? null : selectTaskToEdit(task))}
    >
      <img
        src={task.finishAt ? "/finished.svg" : "/not-finished.svg"}
        alt={task.finishAt ? "Tarefa concluída" : "Tarefa não concluída"}
      />
      <div>
        <p className={task.finishAt ? "concluido" : ""}>{task.name}</p>
        <span>{getDateText(task.finishAt, task.expectedfinishAt)}</span>
      </div>
    </div>
  );
};

export { Item };
