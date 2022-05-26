import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Slider,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import React, { FC, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

export interface ControlProps {
  onClear: () => void;
  onBrushWidthChange: (value: number) => void;
  onSaveChanges: (isPublic: boolean) => void;
  onColorPicked: (color: string) => void;
  onVisibilityChange?: (selected: string) => void;
  onEraserClicked: () => void;
}

export const Controls: FC<ControlProps> = ({
  onClear,
  onBrushWidthChange,
  onSaveChanges,
  onColorPicked,
  onEraserClicked,
  ...rest
}) => {
  const [color, setColor] = useState("#000");
  const [selectedVisibility, setSelectedVisibility] =
    useState<string>("public");

  const [brushWidth, setBrushWidth] = useState<number>(6);

  useEffect(() => {
    onBrushWidthChange(brushWidth);
  }, [brushWidth]);

  useEffect(() => {
    onColorPicked(color);
  }, [color]);

  useEffect(() => {
    if (rest.onVisibilityChange) {
      rest.onVisibilityChange(selectedVisibility);
    }
  }, [selectedVisibility]);

  return (
    <Box
      sx={{
        marginBottom: "20px",
        borderWidth: 1,
        borderColor: "#cdcdcd",
        borderStyle: "solid",
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2} alignContent={"center"} alignItems={"center"}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Typography>Brush width</Typography>
          <Slider
            min={1}
            size="small"
            max={30}
            aria-label="brush width"
            value={brushWidth}
            step={1}
            marks
            onChange={(_, newValue: number | number[]) => {
              setBrushWidth(newValue as number);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Button variant="outlined" onClick={onEraserClicked}>
            Eraser
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <Button
            variant="contained"
            onClick={() => onSaveChanges(selectedVisibility === "public")}
          >
            Save Changes
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Visibility</InputLabel>
            <Select
              labelId="visibility"
              id="visibility"
              value={selectedVisibility}
              label="Drawing Visibility"
              onChange={(value) => setSelectedVisibility(value.target.value)}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <HexColorPicker onChange={(color) => setColor(color)} />
      </Grid>
    </Box>
  );
};
