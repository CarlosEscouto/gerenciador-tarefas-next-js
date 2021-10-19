import type { NextPage } from "next";
import { useState } from "react";

type FilterProps = {
  expectedfinishAtStarts: string;
  setExpectedfinishAtStarts(periodo: string): void;
  expectedfinishAtEnds: string;
  setExpectedfinishAtEnds(periodo: string): void;
  status: number;
  setStatus(status: number): void;
};

const Filter: NextPage<FilterProps> = ({
  expectedfinishAtStarts,
  setExpectedfinishAtStarts,
  expectedfinishAtEnds,
  setExpectedfinishAtEnds,
  status,
  setStatus,
}) => {
  const [showFilters, setShowFilter] = useState(false);

  return (
    <div className="container-filters">
      <div className="title">
        <span>Tarefas</span>
        <img
          src="/filter.svg"
          alt="Filtrar tarefas"
          onClick={(e) => setShowFilter(!showFilters)}
        />
        <div className="form">
          <div>
            <label>Data prevista de conclusão de:</label>
            <input
              type="date"
              value={expectedfinishAtStarts}
              onChange={(date) => setExpectedfinishAtStarts(date.target.value)}
            />
          </div>
          <div>
            <label> até:</label>
            <input
              type="date"
              value={expectedfinishAtEnds}
              onChange={(date) => setExpectedfinishAtEnds(date.target.value)}
            />
          </div>
          <div className="line" />
          <div>
            <label>Status:</label>
            <select
              value={status}
              onChange={(status) => setStatus(Number(status.target.value))}
            >
              <option value={0}>Todas</option>
              <option value={1}>Ativas</option>
              <option value={2}>Concluídas</option>
            </select>
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="filtrosMobile">
          <div>
            <label>Período de:</label>
            <input type="date" />
          </div>
          <div>
            <label>Período até:</label>
            <input type="date" />
          </div>
          <div>
            <label>Status:</label>
            <select>
              <option value={0}>Todas</option>
              <option value={1}>Ativas</option>
              <option value={2}>Concluídas</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export { Filter };
