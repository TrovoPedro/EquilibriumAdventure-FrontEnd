import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "../escolher-data/escolher-data.css";

dayjs.extend(updateLocale);
dayjs.updateLocale("pt-br", { weekStart: 1 });
dayjs.locale("pt-br");

export default function EscolhaDataCard({ onClose }) {
  const [value, setValue] = React.useState(dayjs());
  const [hora, setHora] = React.useState("");
  const [selectOpen, setSelectOpen] = React.useState(false);

  const horarios = ["09:00 - 10:00", "10:30 - 11:30", "12:00 - 13:00"];

  const handleClose = () => {
    setSelectOpen(false);
    onClose();
  };

  const handleSave = () => {
    console.log("Data:", value.format("DD/MM/YYYY"), "Hora:", hora);
    handleClose();
  };

  return (
    <div
      className="overlay"
      style={{ position: "fixed", zIndex: 2000 }}
      onClick={(e) => {
        if (e.target.classList.contains("overlay")) handleClose();
      }}
    >
      <Card className="card-escolha" style={{ position: "relative", zIndex: 2100 }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" className="btn-fechar" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" className="titulo">
            Adicione uma data que você esteja disponível:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateCalendar
              value={value}
              onChange={(newValue) => setValue(newValue)}
              dayOfWeekFormatter={(day) => day.format("ddd")}
              sx={{
                "& .MuiPickersDay-root.Mui-selected, .MuiPickersDay-root.Mui-selected:hover": {
                  backgroundColor: "#2e5e46",
                },
                "& .MuiCalendarPicker-root .Mui-selected": {
                  backgroundColor: "#2e5e46",
                },
              }}
            />
          </LocalizationProvider>

          <Typography variant="h6" align="center" className="titulo" style={{ marginTop: "16px" }}>
            Adicione um horário que você esteja disponível:
          </Typography>

          <div className="select-wrapper">
            <Select
              displayEmpty
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              open={selectOpen}
              onOpen={() => setSelectOpen(true)}
              onClose={() => setSelectOpen(false)}
              className="select-horario"
              MenuProps={{
                disablePortal: true,
                PaperProps: { style: { zIndex: 2300, minWidth: 220 } },
              }}
            >
              <MenuItem value="">
                <em>Escolher Horário</em>
              </MenuItem>
              {horarios.map((h) => (
                <MenuItem key={h} value={h} style={{ textDecoration: "underline" }}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="botoes">
            <Button variant="contained" className="btn-salvar" onClick={handleSave}>
              Salvar Data
            </Button>
            <Button variant="contained" className="btn-calendario">
              Ver Calendário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
