import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { BrandOptions } from "../enums/Enums";

const Dashboard = () => {
  const { selectedBrand } = useAppContext();
  const getBrandDetails = () => {
    switch (selectedBrand) {
      case BrandOptions.Avis:
        return {
          image1: "/media/avis-yaninda.webp",
          image2: "/media/avis1.webp",
          image3: "/media/avis-fenerbahce.png",
          image4: "/media/avis-thy.jpg",
          alt: "AvisCar",
        };
      case BrandOptions.Filo:
        return {
          image1: "/media/avis-filo-transit.png",
          image2: "/media/avis-filo-rent.webp",
          image3: "/media/avis-filo_1.png",
          image4: "/media/avis-filo-2.png",
          alt: "AvisFiloCar",
        };
      case BrandOptions.Budget:
        return {
          image1: "/media/budget-ofis.jpg",
          image2: "/media/budget-online.png",
          image3: "/media/budget-summer.jpg",
          image4: "/media/budget-app.jpg",
          alt: "BudgetCar",
        };

      case BrandOptions.Multinet:
        return {
          image1: "/media/icon1.png.webp",
          image2: "/media/icon2.png.webp",
          image3: "/media/icon3.png.webp",
          image4: "/media/icon4.png.webp",
          alt: "Multinet",
        };
      default:
        return {
          image1: "/media/icon1.png.webp",
          image2: "/media/icon2.png.webp",
          image3: "/media/icon3.png.webp",
          image4: "/media/icon4.png.webp",
          alt: "Multinet",
        };
    }
  };
  const { image1, image2, image3, image4 } = getBrandDetails();

  // const taskInitData: Task[] = [
  //   {
  //     owner: "",
  //     priority: 1,
  //     subject: "McLaren",
  //   },
  //   {
  //     owner: "",
  //     priority: 1,
  //     subject: "March",
  //   },
  //   {
  //     owner: "",
  //     priority: 1,
  //     subject: "Ferrari",
  //   },
  //   {
  //     owner: "",
  //     priority: 1,
  //     subject: "Aston Martin",
  //   },
  //   {
  //     owner: "",
  //     priority: 1,
  //     subject: "Mercedes",
  //   },
  // ];

  // const [tasks, setTasks] = useState<Task[]>(taskInitData);

  // const navigate = useNavigate();
  // const sendTask = () => {
  //   // navigate("/tasks");
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchUserData('get-task', '');
  //       setTasks(response.data)
  //     } catch (error) {
  //       alert(error)
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{ height: { xs: 140, sm: 200, md: 240 } }}
              image={image1}
              alt="Car"
            />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: {
                      xs: "h6.fontSize",
                      sm: "h6.fontSize",
                      md: "h6.fontSize",
                      lg: "18px",
                    },
                  }}
                >
                  Günlük Ziyaret Planım
                </Typography>
              </AccordionSummary>
              <CardContent>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "body2.fontSize",
                        sm: "body1.fontSize",
                        md: "subtitle1.fontSize",
                      },
                      textAlign: "center",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </Typography>
                </AccordionDetails>
              </CardContent>
            </Accordion>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{ height: { xs: 140, sm: 200, md: 240 } }}
              image={image2}
              alt="Car"
            />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: {
                      xs: "h6.fontSize",
                      sm: "h6.fontSize",
                      md: "h6.fontSize",
                      lg: "18px",
                    },
                  }}
                >
                  Görevlerim
                </Typography>
              </AccordionSummary>
              <CardContent>
                <AccordionDetails /*onClick={sendTask}*/>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "body2.fontSize",
                        sm: "body1.fontSize",
                        md: "subtitle1.fontSize",
                      },
                      textAlign: "center",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    {/* <Carousel>
                      {tasks.map((item, index) => (
                        <Typography key={index}>{item.subject}</Typography>
                      ))}
                    </Carousel> */}
                  </Typography>
                </AccordionDetails>
              </CardContent>
            </Accordion>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{ height: { xs: 140, sm: 200, md: 240 } }}
              image={image3}
              alt="Car"
            />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: {
                      xs: "h6.fontSize",
                      sm: "h6.fontSize",
                      md: "h6.fontSize",
                      lg: "18px",
                    },
                  }}
                >
                  Bana Özel Duyurular
                </Typography>
              </AccordionSummary>
              <CardContent>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "body2.fontSize",
                        sm: "body1.fontSize",
                        md: "subtitle1.fontSize",
                      },
                      textAlign: "center",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </Typography>
                </AccordionDetails>
              </CardContent>
            </Accordion>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{ height: { xs: 140, sm: 200, md: 240 } }}
              image={image4}
              alt="Car"
            />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: {
                      xs: "h6.fontSize",
                      sm: "h6.fontSize",
                      md: "h6.fontSize",
                      lg: "18px",
                    },
                  }}
                >
                  Genel Duyurular
                </Typography>
              </AccordionSummary>
              <CardContent>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "body2.fontSize",
                        sm: "body1.fontSize",
                        md: "subtitle1.fontSize",
                      },
                      textAlign: "center",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </Typography>
                </AccordionDetails>
              </CardContent>
            </Accordion>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
