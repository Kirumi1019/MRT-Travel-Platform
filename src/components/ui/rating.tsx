import React from 'react';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder'; // Ensure you have @mui/icons-material installed
import StarIcon from '@mui/icons-material/Star';

interface RatingComponentProps {
  max: number;
  min: number;
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number | null) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ max, min, value, onChange }) => {
    return (
        <div>
            <Rating
                name="customized-rating"
                defaultValue={min}
                value={value}
                max={max}
                onChange={onChange}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                icon={<StarIcon fontSize="inherit" />}
            />
        </div>
    );
};

export default RatingComponent;
