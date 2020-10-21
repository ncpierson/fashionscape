import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  lighten,
  makeStyles,
} from "@material-ui/core";
import { Clear as ClearIcon, Check as CheckIcon } from "@material-ui/icons";

import { toPath } from "hooks/search";

const useItemStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "transparent",
  },
  media: {
    backgroundColor: theme.palette.mode === "dark" && lighten("#121212", 0.05),
    objectFit: "contain",
    padding: theme.spacing(2.5),
  },
  chips: {
    display: "flex",
    marginLeft: theme.spacing(-0.5),
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  iconError: {
    color: theme.palette.error.main,
  },
  iconSuccess: {
    color: theme.palette.success.main,
  },
}));

const Item = (props) => {
  const { colors, images, name, status } = props;

  const classes = useItemStyles();

  const isTradeable = !status.includes("untradeable");
  const isFreeToPlay = status.includes("freetoplay");

  const statusIcon = (hasStatus) =>
    hasStatus ? (
      <CheckIcon className={classes.iconSuccess} />
    ) : (
      <ClearIcon className={classes.iconError} />
    );

  return (
    <Grid item xs={12}>
      <Card className={classes.card} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="span">
            {name}
          </Typography>
          <Box className={classes.chips}>
            <Chip
              label="Free to play"
              icon={statusIcon(isFreeToPlay)}
              size="small"
              variant="outlined"
            />
            <Chip
              label="Tradeable"
              icon={statusIcon(isTradeable)}
              size="small"
              variant="outlined"
            />
          </Box>
        </CardContent>
        <CardMedia
          className={classes.media}
          component="img"
          height="240"
          image={images.detail}
        />
        <CardContent>
          <Typography color="textSecondary" component="span" variant="body2">
            Palette
          </Typography>
          <Box className={classes.chips}>
            {colors.map((color, i) => (
              <ColorSwatch color={color} key={i} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

const useColorStyles = makeStyles({
  root: {
    backgroundColor: (props) => props.color,
    minHeight: 32,
    "&:hover": {
      backgroundColor: (props) => props.color,
    },
  },
});

const ColorSwatch = ({ color }) => {
  const classes = useColorStyles({ color });

  const path = toPath({ searchBy: "color", search: color });

  return (
    <Button
      component={React.forwardRef((props, ref) => (
        <Link {...props} to={path} ref={ref} />
      ))}
      className={classes.root}
      fullWidth
      variant="contained"
    />
  );
};

export default Item;
