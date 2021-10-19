import type { NextPage } from "next";

type FooterProps = {
  setShowModal(state: boolean): void;
};

const Footer: NextPage<FooterProps> = ({ setShowModal }) => {
  return (
    <div className="container-footer">
      <button onClick={() => setShowModal(true)}>
        <img src="/add.svg" alt="Adcionar Tarefa" />
        Adcionar Tarefa
      </button>

      <span>© Copyright - Todos os direitos reservados</span>
    </div>
  );
};

export { Footer };
