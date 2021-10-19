import axios, { Method } from "axios";

export const executeRequest = (
  endpoint: string,
  method: Method,
  body?: any
) => {
  let headers = { Authorization: "" }; //{ "Content-Type": "application/json" } as any;

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const URL = "http://localhost:3000/api/" + endpoint;

  console.table({
    URL,
    method,
    body,
    headers,
  });

  return axios.request({
    url: URL,
    method: method,
    data: body ?? "",
    headers: headers,
    timeout: 30000,
  });
};
