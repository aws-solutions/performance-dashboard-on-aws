import React, { useState, useMemo, useCallback } from "react";
import { useUsers } from "../hooks";
import Button from "../components/Button";
import ScrollTop from "../components/ScrollTop";
import Search from "../components/Search";
import Table from "../components/Table";

function UserListing() {
  const { users } = useUsers();
  const [filter, setFilter] = useState("");

  const onSearch = useCallback((query) => {
    setFilter(query);
  }, []);

  return (
    <>
      <h1>Manage users</h1>
      <p>
        These are all of the users who have access. You can change user roles,
        temporarily disable users and permanently remove them.
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-7 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search id="search" onSubmit={onSearch} size="small" />
              </span>
            </li>
          </ul>
        </div>
        <div className="tablet:grid-col-5 text-right">
          <span>
            <Button variant="base" onClick={() => console.log("Add users")}>
              Add user(s)
            </Button>
          </span>
        </div>
      </div>
      <Table
        selection="multiple"
        screenReaderField="userId"
        filterQuery={filter}
        initialSortByField="userId"
        columns={useMemo(
          () => [
            {
              Header: "Username",
              accessor: "userId",
            },
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Role",
              accessor: "",
              Cell: () => "Admin",
            },
            {
              Header: "Status",
              accessor: "userStatus",
            },
          ],
          []
        )}
        rows={users}
      />
      <div className="text-right">
        <ScrollTop />
      </div>
    </>
  );
}

export default UserListing;
