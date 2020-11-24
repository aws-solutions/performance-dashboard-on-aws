import React, { useState } from "react";
import { useTopicAreas } from "../hooks";
import AlertContainer from "./AlertContainer";
import Spinner from "../components/Spinner";
import Search from "../components/Search";
import { TopicArea } from "../models";
import Button from "../components/Button";
import ScrollTop from "../components/ScrollTop";
import TopicareasTable from "../components/TopicareasTable";

interface Props {
  onDelete: Function;
}

function TopicareaListing(props: Props) {
  const { topicareas, loading } = useTopicAreas();

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<TopicArea | undefined>(undefined);

  const onSearch = (query: string) => {
    setFilter(query);
  };

  const onSelect = (selectedTopicArea: TopicArea) => {
    setSelected(selectedTopicArea);
  };

  const filterDashboards = (topicAreas: Array<TopicArea>): Array<TopicArea> => {
    return topicAreas.filter((topicarea) => {
      const name = topicarea.name.toLowerCase().trim();
      const createdBy = topicarea.createdBy.toLowerCase().trim();
      const query = filter.toLowerCase();
      return name.includes(query) || createdBy.includes(query);
    });
  };

  const sortTopicareas = (topicAreas: Array<TopicArea>): Array<TopicArea> => {
    return [...topicAreas].sort((a, b) => {
      return a.name > b.name ? -1 : 1;
    });
  };

  return (
    <>
      {loading ? (
        <Spinner className="text-center margin-top-9" label="Loading" />
      ) : (
        <>
          <AlertContainer />
          <h3 id="section-heading-h3">{`Topic areas (${topicareas.length})`}</h3>
          <div className="grid-row margin-y-3">
            <div className="tablet:grid-col-4 padding-top-1px">
              <Search id="search" onSubmit={onSearch} size="small" />
            </div>
            <div className="tablet:grid-col-8 text-right">
              <span>
                <Button
                  variant="outline"
                  disabled={!selected}
                  onClick={() => props.onDelete(selected)}
                >
                  Delete
                </Button>
              </span>
              <span>
                <Button
                  variant="outline"
                  disabled={!selected}
                  onClick={() => {}}
                >
                  Edit
                </Button>
              </span>
              <span>
                <Button onClick={() => {}}>Create topic area</Button>
              </span>
            </div>
          </div>
          <TopicareasTable
            topicAreas={sortTopicareas(filterDashboards(topicareas))}
            onSelect={onSelect}
          />
          <div className="text-right">
            <ScrollTop />
          </div>
        </>
      )}
    </>
  );
}

export default TopicareaListing;
