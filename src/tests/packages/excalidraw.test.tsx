import { fireEvent, GlobalTestState, toggleMenu, render } from "../test-utils";
import { Creativeboard, Footer, MainMenu } from "../../packages/excalidraw/index";
import { queryByText, queryByTestId } from "@testing-library/react";
import { GRID_SIZE, THEME } from "../../constants";
import { t } from "../../i18n";
import { useMemo } from "react";

const { h } = window;

describe("<Creativeboard/>", () => {
  afterEach(() => {
    const menu = document.querySelector(".dropdown-menu");
    if (menu) {
      toggleMenu(document.querySelector(".excalidraw")!);
    }
  });

  describe("Test zenModeEnabled prop", () => {
    it('should show exit zen mode button when zen mode is set and zen mode option in context menu when zenModeEnabled is "undefined"', async () => {
      const { container } = await render(<Creativeboard />);
      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(0);
      expect(h.state.zenModeEnabled).toBe(false);

      fireEvent.contextMenu(GlobalTestState.canvas, {
        button: 2,
        clientX: 1,
        clientY: 1,
      });
      const contextMenu = document.querySelector(".context-menu");
      fireEvent.click(queryByText(contextMenu as HTMLElement, "Zen mode")!);
      expect(h.state.zenModeEnabled).toBe(true);
      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(1);
    });

    it("should not show exit zen mode button and zen mode option in context menu when zenModeEnabled is set", async () => {
      const { container } = await render(<Creativeboard zenModeEnabled={true} />);
      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(0);
      expect(h.state.zenModeEnabled).toBe(true);

      fireEvent.contextMenu(GlobalTestState.canvas, {
        button: 2,
        clientX: 1,
        clientY: 1,
      });
      const contextMenu = document.querySelector(".context-menu");
      expect(queryByText(contextMenu as HTMLElement, "Zen mode")).toBe(null);
      expect(h.state.zenModeEnabled).toBe(true);
      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(0);
    });
  });

  it("should render the footer only when Footer is passed as children", async () => {
    //Footer not passed hence it will not render the footer
    let { container } = await render(
      <Creativeboard>
        <div>This is a custom footer</div>
      </Creativeboard>,
    );
    expect(container.querySelector(".footer-center")).toBe(null);

    // Footer passed hence it will render the footer
    ({ container } = await render(
      <Creativeboard>
        <Footer>
          <div>This is a custom footer</div>
        </Footer>
      </Creativeboard>,
    ));
    expect(container.querySelector(".footer-center")).toMatchInlineSnapshot(`
      <div
        class="footer-center zen-mode-transition"
      >
        <div>
          This is a custom footer
        </div>
      </div>
    `);
  });

  describe("Test gridModeEnabled prop", () => {
    it('should show grid mode in context menu when gridModeEnabled is "undefined"', async () => {
      const { container } = await render(<Creativeboard />);
      expect(h.state.gridSize).toBe(null);

      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(0);
      fireEvent.contextMenu(GlobalTestState.canvas, {
        button: 2,
        clientX: 1,
        clientY: 1,
      });
      const contextMenu = document.querySelector(".context-menu");
      fireEvent.click(queryByText(contextMenu as HTMLElement, "Show grid")!);
      expect(h.state.gridSize).toBe(GRID_SIZE);
    });

    it('should not show grid mode in context menu when gridModeEnabled is not "undefined"', async () => {
      const { container } = await render(
        <Creativeboard gridModeEnabled={false} />,
      );
      expect(h.state.gridSize).toBe(null);

      expect(
        container.getElementsByClassName("disable-zen-mode--visible").length,
      ).toBe(0);
      fireEvent.contextMenu(GlobalTestState.canvas, {
        button: 2,
        clientX: 1,
        clientY: 1,
      });
      const contextMenu = document.querySelector(".context-menu");
      expect(queryByText(contextMenu as HTMLElement, "Show grid")).toBe(null);
      expect(h.state.gridSize).toBe(null);
    });
  });

  describe("Test UIOptions prop", () => {
    describe("Test canvasActions", () => {
      it('should render menu with default items when "UIOPtions" is "undefined"', async () => {
        const { container } = await render(
          <Creativeboard UIOptions={undefined} />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "dropdown-menu")).toMatchSnapshot();
      });

      it("should hide clear canvas button when clearCanvas is false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { clearCanvas: false } }} />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "clear-canvas-button")).toBeNull();
      });

      it("should hide export button when export is false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { export: false } }} />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "json-export-button")).toBeNull();
      });

      it("should hide 'Save as image' button when 'saveAsImage' is false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { saveAsImage: false } }} />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "image-export-button")).toBeNull();
      });

      it("should hide load button when loadScene is false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { loadScene: false } }} />,
        );

        expect(queryByTestId(container, "load-button")).toBeNull();
      });

      it("should hide save as button when saveFileToDisk is false", async () => {
        const { container } = await render(
          <Creativeboard
            UIOptions={{ canvasActions: { export: { saveFileToDisk: false } } }}
          />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "save-as-button")).toBeNull();
      });

      it("should hide save button when saveToActiveFile is false", async () => {
        const { container } = await render(
          <Creativeboard
            UIOptions={{ canvasActions: { saveToActiveFile: false } }}
          />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "save-button")).toBeNull();
      });

      it("should hide the canvas background picker when changeViewBackgroundColor is false", async () => {
        const { container } = await render(
          <Creativeboard
            UIOptions={{ canvasActions: { changeViewBackgroundColor: false } }}
          />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "canvas-background-picker")).toBeNull();
      });

      it("should hide the theme toggle when theme is false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { toggleTheme: false } }} />,
        );
        //open menu
        toggleMenu(container);
        expect(queryByTestId(container, "toggle-dark-mode")).toBeNull();
      });

      it("should not render default items in custom menu even if passed if the prop in `canvasActions` is set to false", async () => {
        const { container } = await render(
          <Creativeboard UIOptions={{ canvasActions: { loadScene: false } }}>
            <MainMenu>
              <MainMenu.ItemCustom>
                <button
                  style={{ height: "2rem" }}
                  onClick={() => window.alert("custom menu item")}
                >
                  {" "}
                  custom item
                </button>
              </MainMenu.ItemCustom>
              <MainMenu.DefaultItems.LoadScene />
            </MainMenu>
          </Creativeboard>,
        );
        //open menu
        toggleMenu(container);
        // load button shouldn't be rendered since `UIActions.canvasActions.loadScene` is `false`
        expect(queryByTestId(container, "load-button")).toBeNull();
      });
    });
  });

  describe("Test theme prop", () => {
    it("should show the theme toggle by default", async () => {
      const { container } = await render(<Creativeboard />);
      expect(h.state.theme).toBe(THEME.LIGHT);
      //open menu
      toggleMenu(container);
      const darkModeToggle = queryByTestId(container, "toggle-dark-mode");
      expect(darkModeToggle).toBeTruthy();
    });

    it("should not show theme toggle when the theme prop is defined", async () => {
      const { container } = await render(<Creativeboard theme={THEME.DARK} />);

      expect(h.state.theme).toBe(THEME.DARK);
      //open menu
      toggleMenu(container);
      expect(queryByTestId(container, "toggle-dark-mode")).toBe(null);
    });

    it("should show theme mode toggle when `UIOptions.canvasActions.toggleTheme` is true", async () => {
      const { container } = await render(
        <Creativeboard
          theme={THEME.DARK}
          UIOptions={{ canvasActions: { toggleTheme: true } }}
        />,
      );
      expect(h.state.theme).toBe(THEME.DARK);
      //open menu
      toggleMenu(container);
      const darkModeToggle = queryByTestId(container, "toggle-dark-mode");
      expect(darkModeToggle).toBeTruthy();
    });

    it("should not show theme toggle when `UIOptions.canvasActions.toggleTheme` is false", async () => {
      const { container } = await render(
        <Creativeboard
          UIOptions={{ canvasActions: { toggleTheme: false } }}
          theme={THEME.DARK}
        />,
      );
      expect(h.state.theme).toBe(THEME.DARK);
      //open menu
      toggleMenu(container);
      const darkModeToggle = queryByTestId(container, "toggle-dark-mode");
      expect(darkModeToggle).toBe(null);
    });
  });

  describe("Test name prop", () => {
    it('should allow editing name when the name prop is "undefined"', async () => {
      const { container } = await render(<Creativeboard />);
      //open menu
      toggleMenu(container);
      fireEvent.click(queryByTestId(container, "image-export-button")!);
      const textInput: HTMLInputElement | null = document.querySelector(
        ".ExportDialog .ProjectName .TextInput",
      );
      expect(textInput?.value).toContain(`${t("labels.untitled")}`);
      expect(textInput?.nodeName).toBe("INPUT");
    });

    it('should set the name and not allow editing when the name prop is present"', async () => {
      const name = "test";
      const { container } = await render(<Creativeboard name={name} />);
      //open menu
      toggleMenu(container);
      await fireEvent.click(queryByTestId(container, "image-export-button")!);
      const textInput = document.querySelector(
        ".ExportDialog .ProjectName .TextInput--readonly",
      );
      expect(textInput?.textContent).toEqual(name);
      expect(textInput?.nodeName).toBe("SPAN");
    });
  });

  describe("Test autoFocus prop", () => {
    it("should not focus when autoFocus is false", async () => {
      const { container } = await render(<Creativeboard />);

      expect(
        container.querySelector(".excalidraw") === document.activeElement,
      ).toBe(false);
    });

    it("should focus when autoFocus is true", async () => {
      const { container } = await render(<Creativeboard autoFocus={true} />);

      expect(
        container.querySelector(".excalidraw") === document.activeElement,
      ).toBe(true);
    });
  });

  describe("<MainMenu/>", () => {
    it("should render main menu with host menu items if passed from host", async () => {
      const { container } = await render(
        <Creativeboard>
          <MainMenu>
            <MainMenu.Item onSelect={() => window.alert("Clicked")}>
              Click me
            </MainMenu.Item>
            <MainMenu.ItemLink href="blog.excalidaw.com">
              Creativeboard blog
            </MainMenu.ItemLink>
            <MainMenu.ItemCustom>
              <button
                style={{ height: "2rem" }}
                onClick={() => window.alert("custom menu item")}
              >
                {" "}
                custom menu item
              </button>
            </MainMenu.ItemCustom>
            <MainMenu.DefaultItems.Help />
          </MainMenu>
        </Creativeboard>,
      );
      //open menu
      toggleMenu(container);
      expect(queryByTestId(container, "dropdown-menu")).toMatchSnapshot();
    });

    it("should update themeToggle text even if MainMenu memoized", async () => {
      const CustomExcalidraw = () => {
        const customMenu = useMemo(() => {
          return (
            <MainMenu>
              <MainMenu.DefaultItems.ToggleTheme />
            </MainMenu>
          );
        }, []);

        return <Creativeboard>{customMenu}</Creativeboard>;
      };

      const { container } = await render(<CustomExcalidraw />);
      //open menu
      toggleMenu(container);

      expect(h.state.theme).toBe(THEME.LIGHT);

      expect(
        queryByTestId(container, "toggle-dark-mode")?.textContent,
      ).toContain(t("buttons.darkMode"));

      fireEvent.click(queryByTestId(container, "toggle-dark-mode")!);

      expect(
        queryByTestId(container, "toggle-dark-mode")?.textContent,
      ).toContain(t("buttons.lightMode"));
    });
  });
});
