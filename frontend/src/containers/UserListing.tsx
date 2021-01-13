import React, { useState, useMemo, useCallback } from "react";
import { useUsers } from "../hooks";
import Button from "../components/Button";
import ScrollTop from "../components/ScrollTop";
import Search from "../components/Search";
import Table from "../components/Table";
import { LocationState, User, UserRoles } from "../models";
import BackendService from "../services/BackendService";
import { useHistory } from "react-router-dom";
import Modal from "../components/Modal";
import AlertContainer from "./AlertContainer";

function UserListing() {
  const history = useHistory<LocationState>();
  const { users, reloadUsers } = useUsers();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<User>>([]);
  const [isOpenResendInviteModal, setIsOpenResendInviteModal] = useState(false);

  const onSearch = useCallback((query) => {
    setFilter(query);
  }, []);

  const onSelect = useCallback((selectedUsers: Array<User>) => {
    setSelected(selectedUsers);
  }, []);

  const closeDeleteModal = () => {
    setIsOpenResendInviteModal(false);
  };

  const onResendInvite = () => {
    setIsOpenResendInviteModal(true);
  };

  const resendInvite = async () => {
    closeDeleteModal();

    if (selected.length) {
      await BackendService.resendInvite(selected.map((s) => s.email));

      history.replace("/admin/users", {
        alert: {
          type: "success",
          message: `${selected.length} invitation email${
            selected.length === 1 ? " was" : "s were"
          } resent`,
        },
      });

      await reloadUsers();
    }
  };

  return (
    <>
      <h1>Manage users</h1>

      <Modal
        isOpen={isOpenResendInviteModal}
        closeModal={closeDeleteModal}
        title={"Resend invite"}
        message={`Are you sure you want to resend the invite${
          selected.length === 1 ? " for this user?" : "s for these users?"
        }`}
        buttonType="Resend"
        buttonAction={resendInvite}
      />

      <p>
        These are all of the users who have access. You can change user roles,
        temporarily disable users and permanently remove them.
      </p>
      <AlertContainer />
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-5 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search id="search" onSubmit={onSearch} size="small" />
              </span>
            </li>
          </ul>
        </div>
        <div className="tablet:grid-col-7 text-right">
          <span>
            <Button
              variant="outline"
              disabled={selected.length === 0}
              onClick={onResendInvite}
            >
              Resend invite(s)
            </Button>
          </span>
          <span>
            <Button
              variant="outline"
              disabled={selected.length === 0}
              onClick={() => console.log("Edit roles")}
            >
              Edit role(s)
            </Button>
          </span>
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
        onSelection={onSelect}
        initialSortAscending
        width="100%"
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
              accessor: "roles",
              Cell: (props: any) =>
                props.value && props.value.length
                  ? (props.value as Array<UserRoles>).join(",")
                  : "",
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
