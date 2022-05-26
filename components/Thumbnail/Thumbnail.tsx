import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import { FC, useState } from "react";
import { DrawingData } from "../../pages/api/_db";

interface ThumbnailsProps {
  onlyViewButton?: boolean;
  loggedUser?: string;
  drawing: DrawingData;
  onDeleteDrawing?: (id: string) => void;
}

export const Thumbnail: FC<ThumbnailsProps> = (props) => {
  const { drawing, loggedUser } = props;
  const { id, imageFileName, createdAt, owner, duration, videoFileName } =
    drawing;
  const imageAssetsPath = "/static/images";
  const videoAssetsPath = "/static/videos";

  const [open, setOpen] = useState(false);

  const viewDrawing = (filename: string) => {
    window.open(`${window.origin}${imageAssetsPath}/${filename}`, "_blank");
  };

  const copyUrlToClipboard = async (id: string) => {
    const url = location.origin + "/main/" + id;
    await navigator.clipboard.writeText(url);
    setOpen(true);
  };

  return (
    <Grid key={id} item xs={12} sm={6} md={4}>
      <Card sx={{ maxWidth: 400 }}>
        <CardHeader
          avatar={<Avatar aria-label="art owner">{owner.charAt(0)}</Avatar>}
          title={`Created by: ${owner}`}
          subheader={format(new Date(createdAt), "PPpp")}
        />
        <CardMedia
          image={`${imageAssetsPath}/${imageFileName}`}
          component="img"
          height={250}
        />
        {duration ? (
          <CardContent>
            <Typography>
              It took {duration} to draw{" "}
              {videoFileName ? (
                <Link href={`${videoAssetsPath}/${videoFileName}`}>
                  <a target="_blank" style={{ color: "blue" }}>
                    watch the video
                  </a>
                </Link>
              ) : null}
            </Typography>
          </CardContent>
        ) : null}
        <CardActions>
          {loggedUser === owner && !props.onlyViewButton ? (
            <>
              <Button
                onClick={() => props.onDeleteDrawing?.(id)}
                size="small"
                color="error"
                variant="contained"
              >
                Delete
              </Button>

              <Button
                onClick={() => copyUrlToClipboard(id)}
                size="small"
                color="info"
                variant="outlined"
                sx={{ pl: 2, pr: 2 }}
              >
                copy url
              </Button>

              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                message="Share URL copied to clipboard"
              />
            </>
          ) : null}

          <Button
            onClick={() => viewDrawing(imageFileName)}
            size="small"
            color="primary"
            variant="contained"
          >
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
