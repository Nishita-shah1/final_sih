import React from "react";
import Select, { MultiValue, StylesConfig } from "react-select";

interface SpeciesOption {
    value: string;
    label: string;
}

interface SpeciesSelectorProps {
    selectedSpecies: MultiValue<SpeciesOption>;
    setSelectedSpecies: (species: MultiValue<SpeciesOption>) => void;
}

const speciesOptions: SpeciesOption[] = [
    { value: "ribbon.fish", label: "ribbon.fish" },
    { value: "ponyfishes", label: "ponyfishes" },
    { value: "nemipterids", label: "nemipterids" },
    { value: "goat.fishes", label: "goat.fishes" },
    { value: "croakers", label: "croakers" },
    { value: "indian.mackerel", label: "indian.mackerel" },
    { value: "scad", label: "scad" },
    { value: "carangids", label: "carangids" },
    { value: "anchovies", label: "anchovies" },
    { value: "peaenid.prawns", label: "peaenid.prawns" },
    { value: "elasmobranchs", label: "elasmobranchs" },
    { value: "eels", label: "eels" },
    { value: "cat.fish", label: "cat.fish" },
    { value: "dorab", label: "dorab" },
    { value: "oil.sardine", label: "oil.sardine" },
    { value: "lesser.sardines", label: "lesser.sardines" },
    { value: "hilsa", label: "hilsa" },
    { value: "other.hilsa", label: "other.hilsa" },
    { value: "other.clupeids", label: "other.clupeids" },
    { value: "bombay.duck", label: "bombay.duck" },
    { value: "lizard.fish", label: "lizard.fish" },
    { value: "ghar.fish", label: "ghar.fish" },
    { value: "flying.fish", label: "flying.fish" },
    { value: "polynemids", label: "polynemids" },
    { value: "trevally.carangid", label: "trevally.carangid" },
    { value: "queen.fish.carangid", label: "queen.fish.carangid" },
    { value: "pompano.carangid", label: "pompano.carangid" },
    { value: "other.carangids", label: "other.carangids" },
    { value: "dolphin.fish.carangid", label: "dolphin.fish.carangid" },
    { value: "rainbowrunner.carangid", label: "rainbowrunner.carangid" },
    { value: "leiognathus", label: "leiognathus" },
    { value: "pony.fish", label: "pony.fish" },
    { value: "falsetrevally.lactariidae", label: "falsetrevally.lactariidae" },
    { value: "pomfrets", label: "pomfrets" },
    { value: "seer.fish", label: "seer.fish" },
    { value: "other.tuna", label: "other.tuna" },
    { value: "barracuda", label: "barracuda" },
    { value: "mullet", label: "mullet" },
    { value: "bregmaceros", label: "bregmaceros" },
    { value: "flat.fish", label: "flat.fish" },
    { value: "non.penaeid.prawn", label: "non.penaeid.prawn" },
    { value: "lobsters", label: "lobsters" },
    { value: "crabs", label: "crabs" },
    { value: "mantis.shrimp", label: "mantis.shrimp" },
    { value: "cephalopods", label: "cephalopods" },
    { value: "miscellaneous", label: "miscellaneous" },
    { value: "sail.fish", label: "sail.fish" },
    { value: "yellowfin.tuna", label: "yellowfin.tuna" },
    { value: "skipjack.tuna", label: "skipjack.tuna" },
    { value: "blue.marlin", label: "blue.marlin" },
    { value: "sword.fish", label: "sword.fish" },
    { value: "squid", label: "squid" },
    { value: "yellow.trevally", label: "yellow.trevally" },
    { value: "white.tuna", label: "white.tuna" },
    { value: "malabar.trevally", label: "malabar.trevally" },
    { value: "priacanthids", label: "priacanthids" },
    { value: "cuttle.fish", label: "cuttle.fish" },
    { value: "murrel", label: "murrel" },
    { value: "horse.mackerel", label: "horse.mackerel" },
    { value: "emperor.fish", label: "emperor.fish" },
    { value: "spiny.grouper", label: "spiny.grouper" },
    { value: "octopus", label: "octopus" },
    { value: "shark", label: "shark" },
    { value: "cow.ray", label: "cow.ray" },
    { value: "grouper", label: "grouper" },
    { value: "lion.fish", label: "lion.fish" },
    { value: "ray", label: "ray" },
    { value: "coral.grouper", label: "coral.grouper" },
    { value: "lutjanid", label: "lutjanid" },
    { value: "coronation.grouper", label: "coronation.grouper" },
    { value: "lethrinidlentjan", label: "lethrinidlentjan" },
    { value: "greasy.grouper", label: "greasy.grouper" },
    { value: "areolate.grouper", label: "areolate.grouper" },
    { value: "lyretail.grouper", label: "lyretail.grouper" },
    { value: "baarracuda", label: "baarracuda" },
    { value: "lethrinids", label: "lethrinids" },
    { value: "sardine", label: "sardine" },
    { value: "yellowtail.scad", label: "yellowtail.scad" },
    { value: "indian.scad", label: "indian.scad" },
    { value: "king.fish", label: "king.fish" }
];

const SpeciesSelector: React.FC<SpeciesSelectorProps> = ({ selectedSpecies, setSelectedSpecies }) => {
    const handleRemoveSpecies = (species: SpeciesOption) => {
        setSelectedSpecies(
            selectedSpecies.filter((item) => item.value !== species.value)
        );
    };

    const customStyles: StylesConfig<SpeciesOption, true> = {
        menu: (base) => ({ ...base, backgroundColor: "#3a3a4d" }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#0d2b5d" : "#3a3a4d",
            color: "#fff",
        }),
    };

    return (
        <div className="filter-section">
            <label>Species</label>
            <Select
                options={speciesOptions}
                isMulti
                value={selectedSpecies}
                onChange={setSelectedSpecies}
                className="species-select"
                styles={customStyles}
            />
            <div className="selected-species">
                {selectedSpecies.map((species) => (
                    <span
                        key={species.value}
                        className="species-tag"
                        onClick={() => handleRemoveSpecies(species)}
                    >
                        {species.label} ✕
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SpeciesSelector;