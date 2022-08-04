import React, { useState, useMemo, useCallback } from "react";
import { useUsers } from "../hooks";
import Button from "../components/Button";
import Search from "../components/Search";
import Table from "../components/Table";
import { LocationState, User } from "../models";
import BackendService from "../services/BackendService";
import UtilsService from "../services/UtilsService";
import { useHistory } from "react-router-dom";
import Modal from "../components/Modal";
import AlertContainer from "./AlertContainer";
import DropdownMenu from "../components/DropdownMenu";
import Link from "../components/Link";
import { useTranslation } from "react-i18next";

const MenuItem = DropdownMenu.MenuItem;

function UserListing() {
  const history = useHistory<LocationState>();
  const { users, reloadUsers, setUsers } = useUsers();
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Array<User>>([]);
  const [isOpenResendInviteModal, setIsOpenResendInviteModal] = useState(false);
  const [isOpenRemoveUsersModal, setIsOpenRemoveUsersModal] = useState(false);

  const { t } = useTranslation();

  const addUsers = () => {
    history.push("/admin/users/add");
  };

  const changeRole = () => {
    console.log("selected: ", selected);
    history.push("/admin/users/changerole", {
      emails: selected.map((s) => s.email).join(", "),
      usernames: selected.map((s) => s.userId),
    });
  };

  const removeUsers = async () => {
    if (selected.length) {
      const usernames = selected.map((user) => user.userId);
      try {
        await BackendService.removeUsers(usernames);
        history.replace("/admin/users", {
          alert: {
            type: "success",
            message: `${t("SuccessfullyRemoved")}${selected.length} ${t(
              selected.length === 1 ? "GlobalUser" : "GlobalUsers"
            )}.`,
          },
        });

        // Reload users but also update the UI optimistically because
        // the backend sometimes returns the same list of users including
        // the deleted one due to eventual consistency.
        await reloadUsers();
        setUsers(users.filter((user) => !usernames.includes(user.userId)));
      } catch (err) {
        await reloadUsers();
        history.replace("/admin/users", {
          alert: {
            type: "error",
            message: `${t("UserListingRemoveUserFail")}`,
          },
        });
      } finally {
        setIsOpenRemoveUsersModal(false);
      }
    }
  };

  const onSearch = useCallback((query) => {
    setFilter(query);
  }, []);

  const onSelect = useCallback((selectedUsers: Array<User>) => {
    setSelected(selectedUsers);
  }, []);

  const closeRemoveUsersModal = () => {
    setIsOpenRemoveUsersModal(false);
  };

  const closeResendInviteModal = () => {
    setIsOpenResendInviteModal(false);
  };

  const onResendInvite = () => {
    setIsOpenResendInviteModal(true);
  };

  const onRemoveUsers = () => {
    setIsOpenRemoveUsersModal(true);
  };

  const resendInvite = async () => {
    closeResendInviteModal();

    if (selected.length) {
      await BackendService.resendInvite(selected.map((s) => s.email));

      history.replace("/admin/users", {
        alert: {
          type: "success",
          message:
            selected.length === 1
              ? `${selected.length} ${t("UserListingResentInvites")}`
              : `${selected.length} ${t("UserListingResentInvitesPlural")}`,
        },
      });

      await reloadUsers();
    }
  };

  const resendInviteEmailDisabled = () => {
    return (
      selected.length === 0 ||
      selected.some((s) => s.userStatus !== "FORCE_CHANGE_PASSWORD")
    );
  };

  return (
    <>
      <AlertContainer />
      <h1 className="margin-top-1">{t("ManageUsers")}</h1>
      <Modal
        isOpen={isOpenResendInviteModal}
        closeModal={closeResendInviteModal}
        title={t("UserListingModalTitleResendInvites")}
        message={t("UserListingModalTitleResendInvitesMessage", {
          count: selected.length,
        })}
        buttonType={t("GlobalResend")}
        buttonAction={resendInvite}
      />
      <Modal
        isOpen={isOpenRemoveUsersModal}
        closeModal={closeRemoveUsersModal}
        title={t("UserListingActionsRemoveUsers")}
        message={t("UserListingActionsRemoveUsersMessage", {
          count: selected.length,
        })}
        buttonType={t("GlobalDelete")}
        buttonAction={removeUsers}
      />
      <p>
        {t("UserListingDescription")}{" "}
        <Link target="_blank" to={"/admin/userstatus"} external>
          {t("UserListingLink")}
        </Link>
      </p>
      <div className="grid-row margin-y-3">
        <div className="tablet:grid-col-4 text-left padding-top-1px">
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <span>
                <Search
                  id={t("GlobalSearch")}
                  onSubmit={onSearch}
                  size="small"
                  placeholder={t("Search.SearchUsers")}
                />
              </span>
            </li>
          </ul>
        </div>
        <div className="tablet:grid-col-8 text-right">
          <span>
            <DropdownMenu
              buttonText={t("UserListingDropdownMenuActions")}
              variant="outline"
              ariaLabel={t("ARIA.UserListingActions")}
            >
              <MenuItem
                onSelect={changeRole}
                disabled={selected.length === 0}
                aria-label={t("ARIA.UserListingChangeRole")}
              >
                {t("UserListingDropdownChangeRole")}
              </MenuItem>

              <MenuItem
                onSelect={onResendInvite}
                disabled={resendInviteEmailDisabled()}
                title={t("UserListingDropdownResendInviteText")}
                aria-label={t("ARIA.UserListingResendInvites")}
              >
                {t("UserListingActionsResendInvites")}
              </MenuItem>
              <MenuItem
                onSelect={onRemoveUsers}
                disabled={selected.length === 0}
                aria-label={t("ARIA.UserListingRemoveUsers")}
              >
                {t("UserListingActionsRemoveUsers")}
              </MenuItem>
            </DropdownMenu>
          </span>
          <span>
            <Button variant="base" onClick={addUsers}>
              {t("UserListingAddUsers")}
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
        pageSize={10}
        columns={useMemo(
          () => [
            {
              Header: t("UserListingUsername"),
              accessor: "userId",
            },
            {
              Header: t("UserListingEmail"),
              accessor: "email",
            },
            {
              Header: t("UserListingRole"),
              accessor: (row: User) => t(`UserRoles.${row.roles[0]}`),
            },
            {
              Header: t("UserListingStatus"),
              accessor: (row: User) =>
                t(
                  `UserStatuses.${UtilsService.getTranslationUserStatusValue(
                    row.userStatus
                  )}`
                ),
            },
          ],
          [t]
        )}
        rows={users}
      />
    </>
  );
}

export default UserListing;
