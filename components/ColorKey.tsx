import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

export default function ColorKey({
  successText,
  warningText,
  errorText,
}: {
  successText: React.ReactNode;
  warningText: React.ReactNode;
  errorText: React.ReactNode;
}): React.ReactElement {
  return (
    <Box>
      <Typography variant="h6">Legend</Typography>
      <Grid columns={3} spacing={3} container>
        <Grid item>
          <Card>
            <CardMedia
              sx={{ backgroundColor: "success.main", height: "4rem" }}
            ></CardMedia>
            <CardContent>{successText}</CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardMedia
              sx={{ backgroundColor: "warning.main", height: "4rem" }}
            ></CardMedia>
            <CardContent>{warningText}</CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardMedia
              sx={{ backgroundColor: "error.main", height: "4rem" }}
            ></CardMedia>
            <CardContent>{errorText}</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
