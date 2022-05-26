import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "../../components/Display/Layout";
import { Thumbnail } from "../../components/Thumbnail/Thumbnail";
import { useDrawings } from "../../hooks/useDrawings";
import { useUser } from "../../hooks/useUser";
import { DrawingData } from "../api/_db";

const Main: NextPage = () => {
  const [drawings, setDrawings] = useState<DrawingData[]>([]);

  const data = useDrawings();
  const loggedUser = useUser();

  const [selectedVisibility, setSelectedVisibility] = useState<string>("All");

  const filteredDrawings = useMemo(() => {
    return drawings.filter((drawing) => {
      if (selectedVisibility === "Public") {
        return drawing.isPublic;
      } else if (selectedVisibility === "Private") {
        return !drawing.isPublic;
      } else {
        return true;
      }
    });
  }, [drawings, selectedVisibility]);

  useEffect(() => {
    if (data) {
      setDrawings(data);
    }
  }, [data]);

  const deleteDrawing = async (id: string) => {
    try {
      const response = await fetch(`/api/drawings/${id}`, {
        method: "DELETE",
      });

      const { data: deletedDrawing } = await response.json();
      setDrawings(
        drawings.filter((drawing) => drawing.id !== deletedDrawing.id)
      );
    } catch (error) {}
  };

  return (
    <Layout>
      {loggedUser ? (
        <FormControl sx={{ m: 1, minWidth: 120, mb: 4 }} size="small">
          <InputLabel id="demo-select-small">{selectedVisibility}</InputLabel>
          <Select
            labelId="visibility"
            id="visibility"
            value={selectedVisibility}
            label="Drawing Visibility"
            onChange={(value) => setSelectedVisibility(value.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </Select>
        </FormControl>
      ) : null}

      <Grid container spacing={3}>
        {filteredDrawings.length ? (
          filteredDrawings.map((drawing: DrawingData) => {
            return (
              <Thumbnail
                key={drawing.id}
                loggedUser={loggedUser as string}
                onDeleteDrawing={deleteDrawing}
                drawing={drawing}
              />
            );
          })
        ) : (
          <Grid item>
            <Typography>Nothing to see here</Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Main;
